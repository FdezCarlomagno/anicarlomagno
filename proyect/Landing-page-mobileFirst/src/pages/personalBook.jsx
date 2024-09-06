import React from 'react'
import img1 from '../objects/intAgendas/intAgenda7.jpeg'
import './pagesStyles/personalBook.css'

const personalBook = () => {

    const handleSubmit = (e) => {
        e.preventDefault()
        const message = `Hola! Ani, me gustaria encargarte tu libro de relatos. Muchas gracias!`

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }

    return (
        <div>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Libro de relatos</h1>
            </div>
            <main className="personalBook">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container'>
                        <div className='personalBook-price'><h4>$17000</h4></div>
                        <img src={img1} alt="" />
                    </div>
                    <h2><button className="buy-book-btn" onClick={(e) => handleSubmit(e)}>COMPRAR</button></h2>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h3>"Miradas que narran"</h3>
                        <div className='section-agendaText-flex-column'>
                            <p>
                                Aquí encontrarás relatos de una <span>mujer apasionada</span>, escritos a partir de cada vivencia transitada.
                            </p>
                            <p>
                                Cuando lo tengas en tus manos tambien serán tus relatos, porque seguramente, en alguna de mis frases, en las mujeres que pinto, en las mujeres que elegí para que colorees, o en las palabras que escribí, hay <span>algo de vos</span>.
                            </p>
                            <div>
                                <p>
                                    <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default personalBook