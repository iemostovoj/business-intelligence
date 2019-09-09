import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import {bi} from './general';
// import * as jsPDF from 'jspdf';
import htmlToImage from 'html-to-image';

const styles = {
    card: {
        minWidth: 360,
        minHeight: 210,
        display: 'inline-block',
        textAlign: 'left',
    },
    formControl: {
        minWidth: 150,
        marginBottom: 10,
    },
    gridItem : {
        padding: 10,
    },
    title: {
        fontSize: 14,
    },
    datePicker : {
        width: 150,
    },
    cardContent : {
        paddingBottom: 0,
    },
    dateGroup: {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        marginBottom: "-20px",
        marginLeft: "10px",
    }
};

class RequestComposer extends React.Component {
    state = {
        date: {
            type: this.props.request.date ? this.props.request.date.type : "abs",
            date_unit: this.props.request.date ? this.props.request.date.date_unit :  "w",
            start: this.props.request.date ? this.props.request.date.start :  "2018-05-24",
            end: this.props.request.date ? this.props.request.date.end :  "2019-06-21",
        },
        desk_mob: "desk+mob",
        dp: "dp+nodp",
    };

    // doc = new jsPDF();

    handleChange = event => {
        let propName = event.target.name,
            propValue = event.target.value;

        if (propName === "start_zero") {
            propName = "start";
            propValue = event.target.checked ? "0" : $("#start-date-input").prop("value");
        }

        if (propName === "type") {
            this.state.date.start = propValue === "rel" ? "0" : "2018-05-24";
            this.state.date.end = propValue === "rel" ? "10" : "2019-01-25";
        }

        this.setState(prevState => {
            if (propName == "desk_mob" || propName == "dp") {
                return {[propName]: propValue}
            } else {
                return {
                    date: {
                        ...prevState.date,
                        [propName]: propValue,
                    }
                }
            }
        }, () => this.props.setRequestData(this.state));
    };

    loadBtnClickHandler = (event) => {
        event.preventDefault();
        this.props.loadBtnCallback();
    }

    printBtnClickHandler = (event) => {
        event.preventDefault();
        let btn = event.currentTarget;
        
        $(btn).prop("locked", true);
        this.forceUpdate();
        setTimeout(() => {
            $(btn).prop("locked", false);
            this.forceUpdate();
        }, 3300);
        
        /*this.doc.fromHTML($('#app').html(), 15, 15, {'width': 800});
        this.doc.save('sample-file.pdf');*/

        let date = new Date;
        htmlToImage.toPng(document.getElementById('app'))
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = `data-charts_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;
            link.href = dataUrl;
            link.click();
          });
    }

    componentDidMount = () => {
        this.props.setRequestData(this.state);
    };
  
    render() {
        const { fullWidth } = this.props;
        return (
            <Card style={styles.card}>
                <CardContent style={styles.cardContent}>
                    <form autoComplete="off">
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Grid item style={styles.gridItem}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="date-type">Тип даты</InputLabel>
                                    <Select
                                        value={this.state.date.type}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'type',
                                            id: 'date-type',
                                        }}
                                    >
                                        <MenuItem value={"abs"}>Абсолютная</MenuItem>
                                        <MenuItem value={"rel"}>Относительная</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={styles.gridItem}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="date-unit">Интервал</InputLabel>
                                    <Select
                                        value={this.state.date.date_unit}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'date_unit',
                                            id: 'date-unit',
                                        }}
                                    >
                                        <MenuItem value={"d"}>день</MenuItem>
                                        <MenuItem value={"w"}>неделя</MenuItem>
                                        <MenuItem value={"m"}>месяц</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={styles.gridItem}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="desk_mob">Деск / Моб</InputLabel>
                                    <Select
                                        value={this.state.desk_mob}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'desk_mob',
                                            id: 'desk_mob',
                                        }}
                                    >
                                        <MenuItem value={"desk"}>только desktop</MenuItem>
                                        <MenuItem value={"mob"}>только mobile</MenuItem>
                                        <MenuItem value={"desk,mob"}>desktop и mobile раздельно</MenuItem>
                                        <MenuItem value={"desk+mob"}>desktop и mobile совместно</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={styles.gridItem}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="dp">DP (dynamic payout)</InputLabel>
                                    <Select
                                        value={this.state.dp}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'dp',
                                            id: 'dp',
                                        }}
                                    >
                                        <MenuItem value={"dp"}>только с DP</MenuItem>
                                        <MenuItem value={"nodp"}>без DP</MenuItem>
                                        <MenuItem value={"dp,nodp"}>с DP и без DP раздельно</MenuItem>
                                        <MenuItem value={"dp+nodp"}>с DP и без DP совместно</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justify="flex-start">
                            <div style={styles.dateGroup}>
                                <Grid item >
                                    <FormControl style={styles.formControl}>
                                        <TextField
                                            id="start-date-input"
                                            name="start"
                                            onChange={this.handleChange}
                                            label="Старт"
                                            type={this.state.date.type === "abs" ? "date" : "number"}
                                            value={this.state.date.start}
                                            style={styles.datePicker}
                                            inputProps={{min: 0}}
                                            disabled={ $("#start-date-zero").prop("checked") }
                                        />
                                    </FormControl>
                                </Grid>
                                <FormControlLabel style={{paddingLeft: 5}}
                                    control={
                                        <Checkbox
                                            id="start-date-zero"
                                            name="start_zero"
                                            onChange={this.handleChange}
                                            color="primary"
                                            value="2019-01-25"
                                        />
                                    }
                                    label="С дня релиза"
                                />
                            </div>
                            <Grid item style={{paddingLeft: 10}} >
                                <FormControl style={styles.formControl} style={styles.dateGroup}>
                                    <TextField 
                                        id="start-date-end"
                                        name="end"
                                        onChange={this.handleChange}
                                        label="Конец"
                                        type={this.state.date.type === "abs" ? "date" : "number"}
                                        value={this.state.date.end}
                                        style={styles.datePicker}
                                        inputProps={{min: 0}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item style={{paddingLeft: 20, paddingTop: 70}}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={this.loadBtnClickHandler}
                                >
                                        Load
                                </Button>
                                <Button 
                                    id="save-png"
                                    variant="contained" 
                                    color="primary"
                                    style={{marginLeft: 20}}
                                    onClick={this.printBtnClickHandler}
                                    disabled={ !!$("#save-png").prop("locked") }
                                >
                                        Save as png
                                </Button>
                            </Grid>
                        </Grid>

                        
                    </form>
                </CardContent>
            </Card>
        );
    }
}

export default RequestComposer;