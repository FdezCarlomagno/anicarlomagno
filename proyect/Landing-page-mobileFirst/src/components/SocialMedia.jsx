import React from 'react'
import faceBookSvg from './assets/Facebook.svg'
import instagramSvg from './assets/Instagram.svg'
import TikTokSvg from './assets/TikTok.svg'
import { Image } from '@unpic/react'


const SocialMedia = () => {
    return (
        <div className="socialMedia-section">
            <h2 className="social-title">Seguime en mis redes sociales</h2>
            <div className="socialMedia-container">
                <ul>
                    <li><a href="https://www.instagram.com/anicarlomagno_painting/" target='blank' aria-label="Instagram de Ani (se abre en una pestaña nueva)"><Image src={instagramSvg} alt="" /></a></li>
                    <li><a href="https://www.tiktok.com/@anicarlomagno_painting?_t=8pSFiI1eHB7&_r=1" target='blank' aria-label="TikTok de Ani (se abre en una pestaña nueva)"><Image src={TikTokSvg} alt="" /></a></li>
                    <li><a href="https://www.facebook.com/anicarlomagno"  target='blank' aria-label="Facebook de Ani (se abre en una pestaña nueva)"><Image src={faceBookSvg} alt="" /></a></li>
                </ul>
            </div>
        </div>
    )
}

export default SocialMedia 