import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const url = "https://presyontest.herokuapp.com";

const fetchItems = () => axios.get(`${url}/purchases`);
const deletePurchase = (id) => axios.delete(`${url}/purchases/${id}`);
const confirmPurchase = (id) => axios.put(`${url}/purchases/confirm/${id}`);
const reverseConfirmation = (id) =>
  axios.put(`${url}/purchases/unconfirm/${id}`);
const getItems = () => axios.get(`${url}/items`);
const deleteItem = (id) => axios.delete(`${url}/items/${id}`)

function App() {
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openBandini, setOpenBandini] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [purchase, setPurchase] = React.useState();

  useEffect(() => {
    getAllPurchases();
    getAllItems();
  }, []);

  const handleOpenDelete = (id) => {
    setPurchase(id);
    setOpenDelete(true);
  };

  const handleOpenConfirmation = (id) => {
    setPurchase(id);
    setOpenConfirmation(true);
  };

  const handleOpenConfirmationReverse = async (id) => {
    await reverseConfirmation(id);
    getAllPurchases();
  };

  const handleClose = () => {
    if (openDelete) {
      setOpenDelete(false);
    }
    if (openBandini) {
      setOpenBandini(false);
    }
    if (openConfirmation) {
      setOpenConfirmation(false);
    }
    setPurchase();
  };

  const dismissOrder = async () => {
    if (openDelete) {
      setOpenDelete(false);
      const response = await deletePurchase(purchase);
      if (response.status === 200) {
        setOpenBandini(true);
        getAllPurchases();
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmOrder = async () => {
    const response = await confirmPurchase(purchase);
    if (response.status === 200) {
      getAllPurchases();
      setOpenConfirmation(false);
    }
  };

  const getAllItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const getAllPurchases = async () => {
    try {
      const response = await fetchItems();
      setPurchases(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItemTemp = async (id) => {
    const response = await deleteItem(id);
    if (response.status === 200) {
      getAllItems();
    }
  }

  return (
    <div className="App">
      <TableContainer style={{ margin: "10px auto", width: "98%" }}>
        <Table aria-label="Storage bins">
          <TableHead
            style={{
              backgroundColor: "rgb(63, 81, 181)",
            }}
          >
            <TableRow>
              <TableCell style={{ color: "white" }} align="center">
                Ime i prezime
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Broj telefona
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Email
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Narudžba
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Ukupna cijena
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Potvrdi narudžbu
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Odbaci narudžbu
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (purchase) => (
                  (
                    <TableRow key={purchase._id}>
                      <TableCell align="center">{purchase.name}</TableCell>
                      <TableCell align="center">{purchase.number}</TableCell>
                      <TableCell align="center">{purchase.email}</TableCell>
                      <TableCell
                        align="center"
                        style={{ fontWeight: "bold", padding: 5 }}
                      >
                        {purchase.items.map((item) => (
                          <div>
                            {item.name} ({item.color}, {item.size})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        {purchase.price}.00KM
                      </TableCell>
                      <TableCell align="center">
                        {!purchase.approved ? (
                          <CheckIcon
                            style={{ color: "green" }}
                            onClick={() => handleOpenConfirmation(purchase._id)}
                          />
                        ) : (
                          <BlockIcon
                            style={{ color: "#cbcf00" }}
                            onClick={() =>
                              handleOpenConfirmationReverse(purchase._id)
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="center" style={{ color: "red" }}>
                        <DeleteIcon
                          onClick={() => handleOpenDelete(purchase._id)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
          </TableBody>
          <TableFooter
            style={{
              backgroundColor: "rgb(63, 81, 181)",
              width: "100%",
            }}
          >
            <TableRow>
              <TablePagination
                style={{ color: "white" }}
                rowsPerPageOptions={[5, 10, 50]}
                // colSpan={3}
                count={purchases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <TableContainer style={{ margin: "10px auto", width: "98%" }}>
        <Table aria-label="Storage bins">
          <TableHead
            style={{
              backgroundColor: "rgb(63, 81, 181)",
            }}
          >
            <TableRow>
              <TableCell style={{ color: "white" }} align="center">
                ID
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Naziv
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Opis
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Spol
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Cijena
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Veličine
              </TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Izbriši artikal
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell align="center">{item._id}</TableCell>
                <TableCell align="center">{item.name}</TableCell>
                <TableCell align="center">{item.description}</TableCell>
                <TableCell align="center">{item.gender}</TableCell>
                <TableCell align="center">
                  {item.price}.00KM
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", padding: 5 }}
                >
                  {item.sizes.map((size) => (
                    <div>
                      {size})
                    </div>
                  ))}
                </TableCell>
                <TableCell align="center" style={{ color: "red" }}>
                  <DeleteIcon
                    onClick={() => deleteItemTemp(item._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            style={{
              backgroundColor: "rgb(63, 81, 181)",
              width: "100%",
            }}
          >
            <TableRow>
              <TablePagination
                style={{ color: "white" }}
                rowsPerPageOptions={[5, 10, 50]}
                // colSpan={3}
                count={purchases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Želite li odbaciti ovu narudžbu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dismissOrder} color="primary">
            Da
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ne
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmation}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Želite li potvrditi ovu narudžbu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmOrder} color="primary">
            Da
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ne
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        style={{ width: "100%" }}
        open={openBandini}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Narudžba je...
          </DialogContentText>
          <img
            style={{ maxWidth: "500px" }}
            src={
              "https://scontent-sof1-2.xx.fbcdn.net/v/t31.18172-8/10269116_419727138170541_1408333818687802195_o.jpg?_nc_cat=101&ccb=1-3&_nc_sid=e3f864&_nc_ohc=-lxhkN1aQDcAX8hI0jR&_nc_ht=scontent-sof1-2.xx&oh=aa133be4988ed496b428e1a9861d250d&oe=612A1D16"
            }
          ></img>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
