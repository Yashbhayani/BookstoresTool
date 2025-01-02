import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Authcontex from '../../../../../Context/Auth/AuthContext';
import Productcontex from '../../../../../Context/Product/ProductContext';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../../../Redux';
import { ICategoryModel } from '../../../../../models/model';
import toast from 'react-hot-toast';
import Pagination from '../../../../Module/PaginationComponent/Pagination';
import PageTitle from '../../../../../PageTitle/PageTitle';
import { confirmAlert } from 'react-confirm-alert';

const ListCategory = (props: any) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const context = useContext(Authcontex);
    const Productcontext = useContext(Productcontex);
    const { CheckuserFunction } = context;
    const { CategoryFunction, DeleteCategoryFuncation,
        ActivetedDeleteCategoryFuncation } = Productcontext;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(''); // Column to sort by
    const [sortOrder, setSortOrder] = useState(0);
    const action = bindActionCreators(actionCreators, dispatch);
    const [categoryList, setCategoryList] = useState<ICategoryModel[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(100);
    const [IsActive, setIsActive] = useState("ALL");
    const [IsDeleted, setDeleted] = useState("ALL");
    const [id, setId] = useState('');

    useEffect(() => {
        document.title = PageTitle.ListCategory;
        const token = sessionStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
            CallCheckuser(); // Await the Checkuser function
        } else {
            navigate('/login');
            action.Login(true);
        }
    }, []);

    const onPageChange = (page: any) => {
        setCurrentPage(Number(page));
        CallCategory(page, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
    };


    const onchangeItemsPerPage = (iPerPage: any) => {
        const newItemsPerPage = Number(iPerPage);
        setItemsPerPage(newItemsPerPage)
        CallCategory(1, newItemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
    };

    const CallCheckuser = async () => {
        props.setLoading(true);
        try {
            const response = await CheckuserFunction();
            if (response.Success === true) {
                if (!response.data) {
                    props.setLoading(false);
                } else {
                    await CallCategory(currentPage, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
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
            return false;
        }
    };

    const CallCategory = async (cP: any, iP: number, sB: string, sO: number, Active: string, Deleted: string) => {
        props.setLoading(true);

        try {
            let jsonObject = {
                reversestatus: sO, // order by
                qpara: sB, // order type
                searchKey: searchTerm,
                showActiveType: Active,//showActiveType,
                showDeleteType: Deleted,  // search
                onset_val: (cP - 1) * iP, // offset
                offset_val: iP // limit
            };
            let response = await CategoryFunction(jsonObject);
            if (response.Success) {
                setTotalRecords(response.data.categoryCount);
                setCategoryList(response.data.categoryTypeModels);
                console.log(response.data.categoryTypeModels)
                props.setLoading(false);
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

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    const addCategory = () => {
        navigate('/category/save');
    };

    const searchData = () => {
        CallCategory(1, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
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
        await CallCategory(currentPage, itemsPerPage, columnName, sortOrder === 1 ? 0 : 1, IsActive, IsDeleted);
    };

    const handleStatusChange = (event: any) => {
        const status = event.target.value;
        setIsActive(status);
    };

    const handleDeleteStatusChange = (event: any) => {
        const deleteStatus = event.target.value;
        setDeleted(deleteStatus);
    }

    const handleDelete = async (pid: string) => {
        props.setLoading(true);
        try {
            let response = await DeleteCategoryFuncation(pid);
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

    const Delete = (cid: string) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleDelete(cid),
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

    
    const Restore = (cid: string) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleDelete(cid),
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

    const Edit = (pid: string) => {
        navigate(`/category/edit/${encodeURIComponent(pid)}`);
    }

    const handleActive = async (lid: string) => {
        props.setLoading(true);
        try {
            let response = await ActivetedDeleteCategoryFuncation(lid);
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

    const Activetated = (cid: string) => {
        confirmAlert({
            title: 'confirm to activate delete record',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleActive(cid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name"
        });
    }

    const DeActivated = (cid: string) => {
        confirmAlert({
            title: 'confirm to activate delete record',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => await handleActive(cid),
                },
                {
                    label: 'No',
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
            overlayClassName: "overlay-custom-class-name"
        });
    }
    return (
        <div>
            <h4>Category</h4>
            <hr />
            <div className="navbar navbar-light">
                <div className="container-fluid">
                    <button className="btn btn-outline-primary" type="button" onClick={addCategory}>Add</button>
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
                            # {sortBy === 'id' && <span>{sortOrder === 0 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col" onClick={() => handleSort('CategoryName')}>
                            Product Name {sortBy === 'CategoryName' && <span>{sortOrder === 0 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col" onClick={() => handleSort('CategoryValue')}>
                            Category Value {sortBy === 'CategoryValue' && <span>{sortOrder === 0 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col" onClick={() => handleSort('CategoryPath')}>
                            Category Path {sortBy === 'CategoryPath' && <span>{sortOrder === 0 ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</span>}
                        </th>
                        <th scope="col"> Active </th>
                        <th scope="col"> Delete </th>
                        <th scope="col"> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList && categoryList.map((category, index) => (
                        <tr key={category.id}>
                            <th scope="row">{(currentPage - 1) * itemsPerPage + (index + 1)}</th>
                            <td>{category.productName}</td>
                            <td>{category.categoryValue}</td>
                            <td>{category.categoryPath}</td>
                            <td>
                                {category.isActive ? (
                                    <span role="img" aria-label="Active">&#128994;</span>
                                ) : (
                                    <span role="img" aria-label="Inactive">&#128308;</span>
                                )}
                            </td>
                            <td>
                                {category.isDeleted ? (
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
                                            <button type="button" className="btn btn-outline-warning m-2" onClick={() => Edit(category.id)}>
                                                <span className="bi bi-pencil-square"></span> Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-dark m-2" onClick={() => Restore(category.id)}
                                                style={{ display: category.isDeleted ? 'inline-block' : 'none' }}>
                                                <span className="bi bi-trash"></span> Restore
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-danger m-2" onClick={() => Delete(category.id)}
                                                style={{ display: category.isDeleted ? 'none' : 'inline-block' }}>
                                                <span className="bi bi-trash"></span> Delete
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-danger m-2" onClick={() => Activetated(category.id)}
                                                style={{ display: category.isActive ? 'none' : 'inline-block' }}>
                                                <span className="bi bi-trash"></span> Reactive
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="btn btn-outline-secondary m-2" onClick={() => DeActivated(category.id)}
                                                style={{ display: category.isDeleted ? 'none' : category.isActive ? 'inline-block' : 'none' }}>
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
            <Pagination
                recordsPerPage={itemsPerPage}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                onchangeItemsPerPage={onchangeItemsPerPage} // Correct prop name
            />

        </div>
    )
}

export default ListCategory;
