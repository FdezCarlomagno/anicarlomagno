import Truck from '../components/assets/Truck.svg'
import { Image } from "@unpic/react";

const Envio = () => {
    return (
        <section className="envioSection">
            <Image src={Truck} alt="" />
            <p>Realizamos envíos a<span> todo el país</span></p>
        </section>

    )
}

export default Envio;