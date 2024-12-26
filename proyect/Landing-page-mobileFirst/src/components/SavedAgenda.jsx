

const SavedAgenda = ({agenda, index, handleDeleteAgenda}) => {
    return (
        <div className='customAgenda' key={index}>
        {agenda.type && <h2>{agenda.type}</h2>}
        <div className='myAgenda-img-container'>
            {agenda.bgImg && (
                <img
                    className='imgAgenda-preview'
                    src={agenda.bgImg}
                    alt={agenda.bgImg ? agenda.bgImg : 'Seleccioná una obra con el selector del formulario'}
                />
            )}
            <div className='myAgenda-name-container'>
                {<h2 className={agenda.textDirection} style={{ color: agenda.fontColor }}>{agenda.username}</h2>}
                <div className='align-left'>
                    {agenda.quote && <p><strong>Frase:</strong> {agenda.quote}</p>}
                    {agenda.quote && <p><strong>Comentarios:</strong> {agenda.other}</p>}
                    <button className='delete-agenda' onClick={() => handleDeleteAgenda(index)}>Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SavedAgenda;