import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Gestión de Docentes", () => {
  test("renderiza la aplicación", () => {
    render(<App />);
    expect(screen.getByText(/Gestión de Docentes/i)).toBeInTheDocument();
  });
});
