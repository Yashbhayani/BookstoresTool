import { createBrowserRouter } from "react-router-dom"
import Home from "../Component/MainComponent/HomeComponet/Home";
import path from "path";
import Books from "../Component/MainComponent/BooksComponent/Books";
import Book from "../Component/MainComponent/BookComponent/Book";
import Login from "../Component/AuthComponent/Login";

const Router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/books",
            element: <Books />,
            children: [
                {
                    path: "books/:id",
                    element: <Book />
                }
            ]
        }
    ]
);

export default Router