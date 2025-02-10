import React from 'react'
import faceBookSvg from './assets/Facebook.svg'
import instagramSvg from './assets/Instagram.svg'
import TikTokSvg from './assets/TikTok.svg'
import { Image } from '@unpic/react'


const SocialMedia = () => {
    return (
        <div className="socialMedia-section">
            <h3>Seguime en mis redes sociales</h3>
            <div className="socialMedia-container">
                <ul>
                    <a href="https://www.instagram.com/anicarlomagno_painting/" target='blank'><li><Image src={instagramSvg} alt="" /></li></a>
                    <a href="https://www.tiktok.com/@anicarlomagno_painting?_t=8pSFiI1eHB7&_r=1" target='blank'><li><Image src={TikTokSvg} alt="" /></li></a>
                    <a href="https://www.facebook.com/anicarlomagno"  target='blank'><li><Image src={faceBookSvg} alt="" /></li></a>
                </ul>
            </div>
        </div>
    )
}

export default SocialMedia 