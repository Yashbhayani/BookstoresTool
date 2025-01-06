import React, { useContext, useEffect, useState } from 'react';
import '../ListProductComponent/production.css'
import HomeContext from '../../../../../Context/Home/HomeContext';
import { useNavigate } from 'react-router-dom';
import Authcontex from '../../../../../Context/Auth/AuthContext';
import Productcontex from '../../../../../Context/Product/ProductContext';
import { debounce, upperCase } from 'lodash';
import { DebounceInput } from 'react-debounce-input';
import { IProductSaveModel } from '../../../../../models/savemodel';
import toast from 'react-hot-toast';
import PageTitle from '../../../../../PageTitle/PageTitle';

const AddProduct = (props: any) => {
    const context = useContext(Authcontex);
    const Productcontext = useContext(Productcontex);
    const { CheckuserFunction } = context;
    const { ProductCodeFunction, SaveProductFuncation } = Productcontext;
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        code: '',
        name: '',
    });
    const [isChecked, setIsChecked] = useState(true);


    useEffect(() => {
        document.title = PageTitle.AddProduct;
        const token = sessionStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
            CallCheckuser();
        } else {
            navigate('/login');
        }
    }, []); // Empty dependency array ensures this runs only on mount

    const CallCheckuser = async () => {
        props.setLoading(true);
        try {
            const response = await CheckuserFunction();
            if (response.Success === true) {
                if (!response.data) {
                    navigate('/');
                    props.setLoading(false);
                } else {
                    props.setLoading(false);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.setLoading(true);

        if (!code.trim() || !name.trim()) {
            if (!code.trim()) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    code: 'Code is required',
                }));
            }
            if (!name.trim()) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: 'Name is required',
                }));
            }
            props.setLoading(false);
            return;
        }

        let product: IProductSaveModel = {
            pid: "",
            code: code,
            name: name,
            isActive: isChecked
        }

        const response = await SaveProductFuncation(product);
        if (response.Success) {
            setCode('');
            setName('');
            setIsChecked(true);
            setErrors({
                code: '',
                name: '',
            });
            props.setLoading(false);
            toast.success(response.Message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
        } else {
            props.setLoading(false);
            toast.error(response.Message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            })
        }
    };

    const CheckCode = async (value: any) => {
        const response = await ProductCodeFunction(value);
        if (response.data) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                code: '',
            }));
            props.setLoading(false);
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                code: 'Code is Alredy added',
            }));
            props.setLoading(false);
        }
    }

    const handleCodeChange = (e: any) => {
        const { value } = e.target;
        setCode(value.toUpperCase().replace(/\s/g, ''));
        props.setLoading(true);
        CheckCode(value.toUpperCase().replace(/\s/g, ''))
    };

    const handleNameChange = (e: any) => {
        e.preventDefault();
        const { value } = e.target;
        setName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: '',
        }));
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };


    return (
        <div>
            <h4>Add Product</h4>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="inputCode" className="form-label">Code</label>
                        <DebounceInput
                            type="text"
                            minLength={3}
                            debounceTimeout={300}
                            className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                            id="inputCode"
                            value={code.toUpperCase().replace(/\s/g, '')}
                            onChange={handleCodeChange}
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputName" className="form-label">Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="inputName"
                            value={name}
                            onChange={handleNameChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputName" className="form-label">Is Active </label>
                        <label className="switch m-2">
                            <input type="checkbox" checked={isChecked} onChange={handleToggle} />
                            <span className="slider round"></span>
                        </label>
                    </div>

                </div>
                <button type="submit" className="btn btn-outline-primary m-3">Submit</button>
            </form>
        </div>
    );
}

export default AddProduct;
