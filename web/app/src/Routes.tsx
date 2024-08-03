import { Route, Routes } from "react-router-dom"
import { Engravings } from "./engravings/engraving-view"
import { Home } from "./home"
import { TodoOverview } from "./todo/view/todo-overview"
import { TodoEdit } from "./todo/view/todo-edit"
import React from "react"
import { DbConnector } from "./todo/view/todo-connector"

export const AppRoutes = () => {

    return (
        <Routes>
            <Route index path="/" element={<Home/>}></Route>
            <Route path="/connector" element={<DbConnector/>}></Route>
            <Route path="/engravings" element={<Engravings/>}></Route>
            <Route path="/todos" element={<TodoOverview/>}></Route>
            <Route path="/todo/new" element={<TodoEdit/>}></Route>
            <Route path="/todo/:id" element={<TodoEdit/>}></Route>
        </Routes>
    )
} 