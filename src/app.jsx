import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Note from "./components/note";
import CreateArea from "./components/createArea.jsx";
// import EditArea from "./components/editArea.jsx";
import Loader from "./components/accessories/loader";
// import rawData from "./components/accessories/rawData"
// import rawNotes from "./rawNotes";
import SnackBar from "./components/accessories/snackBar";
import { SnackbarProvider, useSnackbar } from "notistack";
import Modal from "./components/accessories/modal"
import axios from "axios";

function App () {
	// i was inserted
	const [notes, setNotes] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [ itemToEdit, setItemToEdit ] = useState( {
		id: "",
		title: "",
		content: ""
	} );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ openSnackBar, setOpenSnackBar ] = useState( {
		status: false,
		variant: "",
		message: ""
	} )
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ itemToDelete, setItemToDelete ] = useState( {
		id: "",
		title: "",
		content:""
	} );
	
/* this for without DB */
	// useEffect( () => {
	// 	setNotes( [ ...rawData,...rawNotes ] );
	// 	let timerId = setTimeout( ()=>setIsLoading( false ), 3000 );
	// 	return (()=>{clearTimeout(timerId)})
	// }, [] )

	useEffect( () => {
		try {
			axios.get( "http://localhost:4001/" )
				.then( ( res ) => {
					// console.log( res );
					setNotes( [ ...res.data ] )
				} )
				.then( () => {
					setIsLoading( false );
				})
		} catch (error) {
			console.log(error)
		}
		
	},[])



	const handleConfirmDelete = ( idToDelete ) => {
		try {
			axios({
				method: "DELETE",
				url: "http://localhost:4001/deleteNote",
				data: {
					id:idToDelete
				},
			})
				.then((res) => {
					console.log(res.data);
				})
				.then(() => {
					const filteredNote = notes.filter((eachNote) => {
						return eachNote.id !== idToDelete;
					});
					setNotes([...filteredNote]);
					handleCloseModal();
					handleOpenSnackBar(true, "warning", "Delete success!");
				});

			
		} catch (error) {
			console.log(error)
		}
		
	};
	const handleCancelDelete = () => {
		setItemToDelete( {
			id: "",
			title: "",
			content:""
		} );
		setIsEditing( false );
		setItemToEdit({
			id: "",
			title: "",
			content: "",
		});

		handleOpenSnackBar( true, "default", isEditing?"Edit cancelled" : "Delete cancelled" );
		handleCloseModal();
	}

	const handleEdit = (idEdit) => {
		const itemEdit = notes.find((item) => {
			return item.id === idEdit;
		});
		setItemToEdit(itemEdit);
		setIsEditing( true );
		handleOpenModal();
		
	};

	const handleConfirmEdit = () => {
		try {
			axios({
				method: "PATCH",
				url: "http://localhost:4001/updateNote",
				data: {
					id: itemToEdit.id,
					title: itemToEdit.title,
					content: itemToEdit.content,
				},
			})
				.then((res) => {
					console.log(res.data);
				})
				.then(() => {
					const index = notes.findIndex((item) => {
						return item.id === itemToEdit.id;
					});
					notes.splice(index, 1, itemToEdit);
					setNotes([...notes]);
					handleOpenSnackBar(true, "info", "Edit success!");
					setItemToEdit({
						id: "",
						title: "",
						content: "",
					});
					setIsEditing(false);
					handleCloseModal();
				});
			
		} catch (error) {
			console.log(error)
		}

		
	};

	const handleOpenSnackBar = (status, variant = "",message = "") => {
		setOpenSnackBar( {
			status: status,
			variant: variant,
			message:message
		})
	}
	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen( false );
	}

	return (
		<div>
			<Header />
			{/* {isEditing ? (
				<EditArea
					itemToEdit={itemToEdit}
					setItemToEdit={setItemToEdit}
					setIsEditing={setIsEditing}
					handleConfirmEdit={handleConfirmEdit}
					handleOpenSnackBar={handleOpenSnackBar}
				/>
			) : (
				<CreateArea
					notes={notes}
					setNotes={setNotes}
					itemToEdit={itemToEdit}
					handleOpenSnackBar={handleOpenSnackBar}
				/>
			)} */}
			<CreateArea
				notes={notes}
				setNotes={setNotes}
				itemToEdit={itemToEdit}
				handleOpenSnackBar={handleOpenSnackBar}
			/>
			{isLoading ? (
				<Loader />
			) : (
				notes.map((item) => {
					return (
						<Note
							key={item.id}
							title={item.title}
							content={item.content}
							id={item.id}
							// handleConfirmDelete={handleConfirmDelete}
							handleOpenModal={handleOpenModal}
							handleEdit={handleEdit}
							handleCancelDelete={handleCancelDelete}
							setItemToDelete={setItemToDelete}
						/>
					);
				})
			)}
			{/* <Note key={1} title="Note title" content="Note content" /> */}
			<SnackbarProvider maxSnack={3}>
				<SnackBar
					useSnackbar={useSnackbar}
					openSnackBar={openSnackBar}
					handleOpenSnackBar={handleOpenSnackBar}
				/>
			</SnackbarProvider>
			<Modal
				isModalOpen={isModalOpen}
				handleCancelDelete={handleCancelDelete}
				itemToDelete={itemToDelete}
				handleConfirmDelete={handleConfirmDelete}
				isEditing={isEditing}
				setIsEditing={setIsEditing}
				itemToEdit={itemToEdit}
				setItemToEdit={setItemToEdit}
				handleConfirmEdit={handleConfirmEdit}
				handleOpenSnackBar={handleOpenSnackBar}
				handleCloseModal={handleCloseModal}
			/>
			<Footer />
		</div>
	);
}

export default App;
