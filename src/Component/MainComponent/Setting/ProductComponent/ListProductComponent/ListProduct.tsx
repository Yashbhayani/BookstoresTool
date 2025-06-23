import React, { useContext, useEffect, useState } from 'react';
import './production.css';
import Authcontex from '../../../../../Context/Auth/AuthContext';
import toast from 'react-hot-toast';
import Productcontex from '../../../../../Context/Product/ProductContext';
import Pagination from '../../../../Module/PaginationComponent/Pagination';
import { IProductModel } from '../../../../../models/model';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../../../Redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../../../PageTitle/PageTitle';
import DeleteConfirmationModal from '../../../../../ConfirmationModel/Delete/DeleteConfirmationModal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const initialProductList: IProductModel[] = [];
const ListProduct = (props: any) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Assuming useNavigate is imported correctly

    const context = useContext(Authcontex);
    const Productcontext = useContext(Productcontex);
    const { CheckuserFunction } = context;
    const { ProductFunction, DeleteProductFuncation, ActiveteProductFuncation, DeActiveProductFuncation, RestoreProductFuncation } = Productcontext;
    const [sortBy, setSortBy] = useState(''); // Column to sort by
    const [sortOrder, setSortOrder] = useState(0);
    const [IsActive, setIsActive] = useState("ALL");
    const [IsDeleted, setDeleted] = useState("ALL");

    const [searchTerm, setSearchTerm] = useState('');
    const [id, setId] = useState('');

    const action = bindActionCreators(actionCreators, dispatch);
    const [productList, setProductList] = useState<IProductModel[]>(initialProductList);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(10);

    const [modalShow, setModalShow] = useState(false);
    const [IsDeleteORActive, setIsDeleteORActive] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");


    useEffect(() => {
        document.title = PageTitle.ListProduct;

        const token = sessionStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
            CallCheckuser();
        } else {
            navigate('/login');
            action.Login(true);
        }
    }, [currentPage, itemsPerPage]); // Empty dependency array ensures this runs only on mount

    const onPageChange = (page: any) => {
        const newCurrentPage = Number(page);
        setCurrentPage(newCurrentPage);
        CallProduct(newCurrentPage, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
    };

    const onchangeItemsPerPage = (iPerPage: any) => {
        const newItemsPerPage = Number(iPerPage);
        setItemsPerPage(newItemsPerPage)
        CallProduct(1, newItemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
    };


    const CallCheckuser = async () => {
        props.setLoading(true);
        try {
            const response = await CheckuserFunction();
            if (response.Success === true) {
                if (!response.data) {
                    props.setLoading(false);
                    navigate("/");
                } else {
                    await CallProduct(currentPage, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
                }
            } else {
                props.setLoading(false);
            }
        } catch {
            toast.error("Server is not working", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
            props.setLoading(false);
        }
    };

    const CallProduct = async (cP: any, iP: any, sB: string, sO: number, Active: string, Deleted: string) => {
        props.setLoading(true);
        try {
            let jsonObject = {
                reversestatus: sO, // order by
                qpara: sB, // order type
                searchKey: searchTerm, // search key
                showActiveType: Active,//showActiveType,
                showDeleteType: Deleted, //showDeleteType
                onset_val: (Number(cP) - 1) * Number(iP), // offset
                offset_val: Number(iP) // limit
            };

            let response = await ProductFunction(jsonObject);
            if (response.Success) {
                console.log(response.data);
                setTotalRecords(response.data.count);
                setProductList(response.data.listdata);
                props.setLoading(false);
            } else {
                setTotalRecords(0);
                setProductList([]);
                props.setLoading(false);
            }
        } catch {
            toast.error("Server is not working", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
            props.setLoading(false);
        }
    };

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    const addProduct = () => {
        navigate('/product/save');
    };

    const searchData = () => {
        CallProduct(1, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
    }

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 0 ? 1 : 0);
    };

    const handleSort = async (columnName: any) => {
        if (sortBy === columnName) {
            toggleSortOrder();
        } else {
            setSortBy(columnName);
            toggleSortOrder();
        }
        await CallProduct(currentPage, itemsPerPage, columnName, sortOrder, IsActive, IsDeleted);
    };

    const Edit = (pid: string) => {
        navigate(`/product/edit/${encodeURIComponent(pid)}`);
    }

    const handleClose = () => setModalShow(false);

    const handleDelete = async (pid: string) => {
        props.setLoading(true);
        try {
            let response = await DeleteProductFuncation(pid);
            setId('');
            if (response.Success) {
                CallCheckuser();
                toast.success(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            } else {
                toast.error(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            }
        } catch (error) {
            toast.error('An error occurred', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
        } finally {
            props.setLoading(false);
        }
    };


    const handleRestore = async (pid: string) => {
        props.setLoading(true);
        try {
            let response = await RestoreProductFuncation(pid);
            setId('');
            if (response.Success) {
                CallCheckuser();
                toast.success(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            } else {
                toast.error(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            }
        } catch (error) {
            toast.error('An error occurred', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
        } finally {
            props.setLoading(false);
        }
    };

    const handleActive = async (pid: string) => {
        props.setLoading(true);
        try {
            let response = await ActiveteProductFuncation(pid);
            setId('');
            if (response.Success) {
                CallCheckuser();
                toast.success(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            } else {
                toast.error(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            }
        } catch (error) {
            toast.error('An error occurred', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
        } finally {
            props.setLoading(false);
        }
    };

    const handleDeActive = async (pid: string) => {
        props.setLoading(true);
        try {
            let response = await DeActiveProductFuncation(pid);
            setId('');
            if (response.Success) {
                CallCheckuser();
                toast.success(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            } else {
                toast.error(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
            }
        } catch (error) {
            toast.error('An error occurred', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
        } finally {
            props.setLoading(false);
        }
    };

    const Restore = (pid: string) => {
        props.confirmAlert({
            title: 'Confirm to Restore!',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleRestore(pid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name",

        });
    };

    const Delete = (pid: string) => {
        confirmAlert({
            title: 'Confirm to Delete!',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleDelete(pid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name",

        });
    };

    const Activetated = (pid: string) => {
        confirmAlert({
            title: 'Activate this record!',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleActive(pid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name"
        });
    };

    const DeActivated = (pid: string) => {
        confirmAlert({
            title: 'Deactivate this record!',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleDeActive(pid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name"
        });
    };
    const handleStatusChange = (event: any) => {
        const status = event.target.value;
        setIsActive(status);
    };

    const handleDeleteStatusChange = (event: any) => {
        const deleteStatus = event.target.value;
        setDeleted(deleteStatus);
    };



    return (
        <div>
            <h4>Product</h4>
            <hr />
            <div className="navbar navbar-light">
                <div className="container-fluid">
                    <button className="btn btn-outline-primary" type="button" onClick={addProduct}>Add</button>
                    <div className="d-flex align-items-center ms-3">
                        <div className="d-flex align-items-center me-3">
                            {/* First Dropdown with Label */}
                            <label htmlFor="statusFilter" className="form-label mb-0 me-2 align-self-center">Active:</label>
                            <select id="statusFilter" className="form-select" aria-label="Filter status" onChange={handleStatusChange}>
                                <option value="ALL">ALL</option>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-center me-3">
                            {/* Second Dropdown with Label */}
                            <label htmlFor="deleteStatusFilter" className="form-label mb-0 me-2 align-self-center">Delete:</label>
                            <select id="deleteStatusFilter" className="form-select" aria-label="Filter deletion status" onChange={handleDeleteStatusChange}>
                                <option value="ALL">ALL</option>
                                <option value="IsDeleted">Deleted</option>
                                <option value="IsNotDeleted">Non Deleted</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-center">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleSearchChange} />
                            <button className="btn btn-outline-success" type="button" onClick={searchData}>Search</button>
                        </div>
                    </div>
                </div>
            </div>





            <table className="m-3 table">
                <thead className="table-primary">
                    <tr>
                        <th scope="col" onClick={() => handleSort('id')}>
                            # {sortBy === 'id' && <span>{sortOrder === 1 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col" onClick={() => handleSort('Name')}>
                            Name {sortBy === 'Name' && <span>{sortOrder === 1 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col">Active</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map((product, index) => (
                        <tr key={product.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{product.name}</td>
                            <td>
                                {product.isActive ? (
                                    <span role="img" aria-label="Active">&#128994;</span>
                                ) : (
                                    <span role="img" aria-label="Inactive">&#128308;</span>
                                )}
                            </td>
                            <td>
                                {product.isDeleted ? (
                                    <span role="img" aria-label="Active">&#128994;</span>
                                ) : (
                                    <span role="img" aria-label="Inactive">&#128308;</span>
                                )}
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-outline-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        Action
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button type="button" className="btn btn-outline-warning m-2" onClick={() => Edit(product.id)}>
                                                <span className="bi bi-pencil-square"></span> Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-danger m-2" onClick={() => Delete(product.id)}
                                                style={{ display: product.isDeleted ? 'none' : 'inline-block' }}>
                                                <span className="bi bi-trash"></span> Delete
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-dark m-2" onClick={() => Restore(product.id)}
                                                style={{ display: product.isDeleted ? 'inline-block' : 'none' }}>
                                                <span className="bi bi-trash"></span> Restore
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-success m-2" onClick={() => Activetated(product.id)}
                                                style={{ display: product.isDeleted ? 'none' : !product.isActive ? 'inline-block' : 'none'}}>
                                                <span className="bi bi-trash"></span> Activate
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-secondary m-2" onClick={() => DeActivated(product.id)}
                                                style={{ display: product.isDeleted ? 'none' : product.isActive ? 'inline-block' : 'none' }}>
                                                <span className="bi bi-trash"></span> Deactivate
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <DeleteConfirmationModal
                show={modalShow}
                message={modalMessage}
                id={id}
                handleClose={handleClose}
                onConfirm={handleDelete}
            /> */}

            <Pagination
                recordsPerPage={totalRecords}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                onchangeItemsPerPage={onchangeItemsPerPage} // Correct prop name
            />
        </div>
    );
};

export default ListProduct;
