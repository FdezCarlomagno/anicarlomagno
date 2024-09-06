import { Link } from 'react-router-dom';
import cuadros from '../objects/newPaintings.jsx';
import { useState, useMemo } from 'react'

const PaintingImgsSection = () => {
    const [seeMore, setSeeMore] = useState(12);

    const handleSeeMore = (e) => {
        e.preventDefault();
        setSeeMore(seeMore + 3);
    };

    const displayedCuadros = useMemo(() => cuadros.slice(0, seeMore), [seeMore]);

    return (
        <div>
            <div className='paintingImgs-section'>
                <Link to="/obras-en-stock">
                    {displayedCuadros.map((cuadro, index) => (
                        <div className='paintingImgs-box' key={index}>
                            <img src={cuadro.src} alt={cuadro.title} />
                        </div>
                    ))}
                </Link>
            </div>
            <div className="seeMorePaintings">
                {seeMore < cuadros.length && <button className='linkTo-aboutMe-btn' onClick={(e) => handleSeeMore(e)}>Ver más</button>}
            </div>

        </div>
    );
};

export default PaintingImgsSection;

