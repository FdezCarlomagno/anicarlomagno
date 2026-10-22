import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <main id="main" className="notFound">
    <p className="notFound-code" aria-hidden="true">404</p>
    <h1 className="notFound-title">No encontramos esta página</h1>
    <p className="notFound-text">
      Puede que el link esté mal escrito o que la página ya no exista. Mientras tanto, podés volver al inicio o mirar las obras que tengo en stock.
    </p>
    <div className="notFound-actions">
      <Link to="/" className="notFound-btn notFound-btn--primary">Volver al inicio</Link>
      <Link to="/obras-en-stock" className="notFound-btn">Ver obras en stock</Link>
    </div>
  </main>
);

export default NotFound;
