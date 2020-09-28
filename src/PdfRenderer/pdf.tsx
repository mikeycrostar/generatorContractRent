import React from "react";
import {Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, Image} from '@react-pdf/renderer';
import moment from "moment";
import "moment/locale/fr";

moment.locale('fr');

class Pdf extends React.Component<any, any> {
    styles = StyleSheet.create({
        viewer: {width: "100vw", height: "50vh"},
        page: {padding: 60},
        header: {fontSize: 30, textAlign: "center", marginTop: 30, marginBottom: 55, fontWeight: 600},
        subheader: {fontSize: 20, textAlign: "center", marginBottom: 30},
        address: {marginBottom: 15, fontSize: 12},
        textContract: {textAlign: "justify", lineHeight: 1.5, fontSize: 14},
        details: {marginTop: 10, fontSize: 14},
        signature: {marginTop: 15, fontSize: 14},
        image: {width: 100, height: 100}
    })

    render(): React.ReactNode {
        const {data: {dates, landlord, cost, costWords, currency, tenant, addressTenant, city, file }} = this.props;
        const doc = dates.map((date: any, index: number) => {
            const monthsWords = moment(date).format("MMMM YYYY");
            const dateOfTheDay = moment(date).format("DD/MM/YYYY");
            const MonthsFirstDay = moment(date).startOf("month").format("DD/MM/YYYY");
            const MonthsLastDay = moment(date).endOf("month").format("DD/MM/YYYY");
            return <Page size="A4" key={index} style={this.styles.page}>
                <View>
                    <Text style={this.styles.header}>
                        Quittance de loyer
                    </Text>
                </View>
                <View>
                    <Text style={this.styles.subheader}>
                        Quittance de loyer du mois de {monthsWords}
                    </Text>
                </View>
                <View>
                    <Text style={this.styles.address}>
                        Adresse de la location:{"\n"} {addressTenant}, {city}
                    </Text>
                </View>
                <View>
                    <Text style={this.styles.textContract}>
                        Je soussigné(e) {landlord}&nbsp;
                        propriétaire du logement désigné ci-dessus, déclare avoir reçu&nbsp;
                        de {tenant} la somme
                        de {cost} {currency} ({costWords} {currency})&nbsp;
                        au titre de paiement du loyer et des charges pour la période de location&nbsp;
                        du {MonthsFirstDay} au {MonthsLastDay}&nbsp;
                        et lui en donne la quittance, sous réserve de mes droits.&nbsp;
                    </Text>
                </View>
                <View>
                    <Text style={this.styles.details}>
                        Détail du règlement
                        {"\n"}
                        {"\n"}
                        Loyer: {cost} {currency}{"\n"}
                        Provision de charge: 0 {currency}{"\n"}
                        Total: {cost} {currency}{"\n"}
                        {"\n"}
                        Date du paiement: {MonthsFirstDay}
                        {"\n"}
                    </Text>
                </View>
                <View>
                    <Text style={this.styles.signature}>
                        Fait à {city}, Le {dateOfTheDay}
                        {"\n"}
                        {"\n"}
                        Signature:{"\n"}
                        <Image style={this.styles.image} source={file}/>
                    </Text>
                </View>
            </Page>
        });
        const docRender = <Document>
            {doc}
        </Document>
        return <div><PDFViewer style={this.styles.viewer}>
            {docRender}
        </PDFViewer>
            <PDFDownloadLink document={docRender}/>
        </div>
    }
}

export default Pdf;
