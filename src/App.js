import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Admin from "./pages/admin";
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
