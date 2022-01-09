import './projectCard.css'
import PropTypes from 'prop-types'

const ProjectCard = (props) => {
    return(
        <div className="col">
            <div className='card border rounded shadow'>
                <div className='card-body'>
                    <h2 className='card-title'>{props.name}</h2>
                    <p className='card-text'>{props.desc}</p>
                </div>
            </div>
        </div>
    )
}
ProjectCard.propTypes ={
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired
}

export default ProjectCard;