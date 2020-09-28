import React from 'react';
import moment from "moment";
import './App.css';
import Pdf from "./PdfRenderer/pdf";
import {currencies} from "./allCurrency";
import {ContractModel} from "./contract.model";

const writtenNumber = require('written-number');
const Buffer = require('buffer/').Buffer

class App extends React.Component<any, any> {
    private currentDate: any;
    private showPdf: any;

    constructor(props: any) {
        super(props);
        this.showPdf = null;
        this.state = {
            file: {data: [], format: ""},
            landlord: "",
            tenant: "",
            addressTenant: "",
            cost: 0,
            currency: "EUR",
            costWords: "",
            monthFrom: moment().format("YYYY-MM-DD"),
            monthTo: moment().format("YYYY-MM-DD"),
            dates: [],
            city: "",
            signature: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSignature = this.handleChangeSignature.bind(this);
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.showPdf = this.generateArrayWithInfo();
    }

    handleChange(e: any) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    handleChangeSignature(e: any) {
        e.preventDefault();
        this.handleChange(e);
        let reader = new FileReader();
        const ext = e.target.files?.[0].name.split(".")[1].toLocaleLowerCase();
        reader.readAsArrayBuffer(e.target.files?.[0]);
        reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            this.setState({file: { data : buffer, format: ext }});}
    }

    generateArrayWithInfo() {
        this.currentDate = moment(this.state.monthFrom);
        const infoBuilder: ContractModel = {
            signature: this.state.signature,
            landlord: this.state.landlord,
            tenant: this.state.addressTenant,
            addressTenant: this.state.addressTenant,
            cost: this.state.cost,
            costWords: writtenNumber(this.state.cost, {lang: "fr"}),
            city: this.state.city,
            currency: this.state.currency,
            monthFrom: this.state.monthFrom,
            monthTo: this.state.monthTo,
            dates: []
        };
        while (moment(this.currentDate).isBefore(moment(this.state.monthTo), "month")) {
            infoBuilder.dates.push(this.currentDate.format("YYYY-MM-DD") as never);
            this.currentDate = moment(this.currentDate).add(1, "months");
        }
        infoBuilder.dates.push(this.currentDate.format("YYYY-MM-DD") as never);
        this.setState(infoBuilder);
    }

    render(): React.ReactNode {
        const hasInfoPdf = this.state.dates.length === 0 ? null: this.state.dates.length;
        const options = [];
        for (const option in currencies) {
            let key: string = option;
            //@ts-ignore
            options.push(<option key={key} value={key}>{currencies[key].name}</option>);
        }
        return (
            <div>
                <h1>Saisir information concernant le logement</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="landlord">Propriétaire</label>
                    <input id="landlord" name="landlord" onChange={this.handleChange} value={this.state.landlord}/>
                    <label htmlFor="tenant">Locataire</label>
                    <input id="tenant" name="tenant" onChange={this.handleChange} value={this.state.tenant}/>
                    <label id="addressTenant">Adresse du logement</label>
                    <input id="addressTenant" name="addressTenant" onChange={this.handleChange}
                           value={this.state.addressTenant}/>
                    <label htmlFor="currency">Monnaie </label>
                    <select id="currency" value={this.state.currency} name="currency" onChange={this.handleChange}>
                        {options}
                    </select>
                    <label htmlFor="city">Ville</label>
                    <input id="city" name="city" onChange={this.handleChange} value={this.state.city}/>
                    <label htmlFor="cost">Prix du loyer</label>
                    <input id="cost" name="cost" onChange={this.handleChange} value={this.state.cost}/>
                    <label htmlFor="monthFrom">Mois de début</label>
                    <input type="date" id="monthFrom" onChange={this.handleChange} name="monthFrom"
                           value={this.state.monthFrom}/>
                    <label htmlFor="monthTo">Mois de fin</label>
                    <input type="date" id="monthTo" onChange={this.handleChange} name="monthTo"
                           value={this.state.monthTo}/>
                    <label htmlFor="signature">Signature</label>
                    <input type="file" id="signature" name="signature" onChange={this.handleChangeSignature}
                           value={this.state.signature}/>
                    <button type="submit">Générer</button>
                    <hr/>
                </form>
                {hasInfoPdf && (<Pdf data={this.state}/>)}
            </div>
        );
    }
}

export default App;
