import React, { Component } from 'react'
import Weather from 'components/Weather/Weather.jsx'
import { Row, Button, Col, TextInput } from 'react-materialize'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import CitiesAutocomplete from 'components/CitiesAutocomplete.jsx'
import Museums from 'components/Museums/Museums.jsx'
import Vehicles from 'components/Vehicles/Vehicles.jsx'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            car: undefined,
            cityName: '',
        }
    }

    /**
     * Méthode appelée dès que l'utlisateur clique sur le bouton de recherche de ville
     * Ajoute la valeur de l'attribut "cityName" de l'état interne en tant que paramètre "nom" dans l'URI
     * Appelle automatiquement la fonction render
     */
    handleClickCity = () => {
        let query = {}
        const { cityName } = this.state
        if (cityName) {
            query['nom'] = cityName
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }

    handleClickCar = () => {
        let query = {}
        if (this.state.car) {
            query['car'] = this.state.car
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }

    /**
     * Handler appelé dès qu'une nouvelle valeur est entrée dans l'autocomplete de villes
     * Change l'attribut "cityName" de l'état interne par la valeur de l'autocomplete et appelle automatiquement la fonction render()
     */
    handleCityChange = (cityName) => {
        this.setState({ cityName: cityName })
    }

    updateCarValue = (e) => {
        this.setState({ car: e.target.value })
    }

    render() {
        // Paramètres de l'URI sous la forme d'un objet javascript "clé": "valeur"
        const query = queryString.parse(this.props.location.search)
        // S'il existe un paramètre nom dans l'URI et qu'il correspond à une ville connue
        // la variable city prend l'objet correspondant avec son nom, ses coordonées, etc.
        // sinon la variable vaut un objet vide
        const city = query.nom ? this.props.cities.find((city) => city.nom === query.nom) : {}
        return (
            <>
                <Row>
                    <CitiesAutocomplete placeholder="Ville" cities={this.props.cities} onCityChange={this.handleCityChange} />
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCity} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>
                    <TextInput placeholder="Véhicule" id="CarInput" onChange={this.updateCarValue} />
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCar} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>{query.car && <Vehicles car={query.car} />}</Row>
                <Row>{query.nom && city && <Museums ville={query.nom} />}</Row>
                <Row>{query.nom && city && <Weather nom={city.nom} lat={Number(city.centre.coordinates[1])} lon={Number(city.centre.coordinates[0])} />}</Row>
            </>
        )
    }
}

MainForm.propTypes = {
    cities: PropTypes.array.isRequired,
}

export default withRouter(MainForm)
