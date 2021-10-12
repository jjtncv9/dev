import React, {useState, useEffect} from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Table
} from "reactstrap";

// import DateTimePicker from '@material-ui/lab/DateTimePicker';

import {
	// Card,
	// CardHeader,
	// CardContent,
	Grid,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	NativeSelect,
	TextField,
	Select,
	MenuItem
} from "@material-ui/core";
import moment from 'moment';  
// import fire from '../../../fire'
// import fire from '../../../configs/FirebaseConfig'
import {firebase} from '../../../auth/FirebaseAuth'
// import firebase from 'firebase/app';
// import * as firebase from 'firebase/firebase';


// import { auth, db } from 'auth/FirebaseAuth';



// import DateFnsUtils from '@date-io/date-fns';

// import {
// 	MuiPickersUtilsProvider,
// 	KeyboardTimePicker,
// 	KeyboardDatePicker,
// } from '@material-ui/pickers';

// import ReactDatetime from "react-datetime";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

const dateArr = new Date().toISOString().split(':', 2);
const today = dateArr[0] + ":" + dateArr[1];

var date = new Date();
date.setDate(date.getDate() - 7);
const last_weekArr = date.toISOString().split(':', 2);
const last_week = last_weekArr[0] + ":" + last_weekArr[1];
// console.log(last_week)

var counties = ['ALL','ADAIR', 'ADAMS', 'ALEXANDER', 'ANDREW', 'ATCHISON', 'AUDRAIN',
'BARRY', 'BARTON', 'BATES', 'BENTON', 'BOLLINGER', 'BOONE',
'BUCHANAN', 'BUTLER', 'CALDWELL', 'CALLAWAY', 'CAMDEN',
'CAPE GIRARDEAU', 'CARROLL', 'CARTER', 'CASS', 'CEDAR', 'CHARITON',
'CHRISTIAN', 'CLARK', 'CLAY', 'CLINTON', 'COLE', 'COOPER',
'CRAWFORD', 'DADE', 'DALLAS', 'DAVIESS', 'DEKALB', 'DENT',
'DOUGLAS', 'DUNKLIN', 'FRANKLIN', 'FREMONT', 'GASCONADE', 'GENTRY',
'GREENE', 'GRUNDY', 'HARRISON', 'HENRY', 'HICKORY', 'HOLT',
'HOWARD', 'HOWELL', 'IRON', 'JACKSON', 'JASPER', 'JEFFERSON',
'JOHNSON', 'KNOX', 'LACLEDE', 'LAFAYETTE', 'LAWRENCE', 'LEWIS',
'LINCOLN', 'LINN', 'LIVINGSTON', 'MACON', 'MADISON', 'MARIES',
'MARION', 'MCDONALD', 'MERCER', 'MIAMI', 'MILLER', 'MISSISSIPPI',
'MONITEAU', 'MONROE', 'MONTGOMERY', 'MORGAN', 'NEW MADRID',
'NEWTON', 'NODAWAY', 'OREGON', 'OSAGE', 'OZARK', 'PEMISCOT',
'PERRY', 'PETTIS', 'PHELPS', 'PIKE', 'PLATTE', 'POLK', 'PULASKI',
'PUTNAM', 'RALLS', 'RANDOLPH', 'RAY', 'REYNOLDS', 'RIPLEY',
'SALINE', 'SCHUYLER', 'SCOTLAND', 'SCOTT', 'SHANNON', 'SHELBY',
'ST CHARLES', 'ST CLAIR', 'ST FRANCOIS', 'ST LOUIS',
'ST LOUIS (CITY)', 'ST. CHARLES', 'ST. CLAIR', 'ST. FRANCOIS',
'ST. LOUIS', 'ST. LOUIS (CITY)', 'ST. LOUIS CITY', 'STE GENEVIEVE',
'STE. GENEVIEVE', 'STODDARD', 'STONE', 'SULLIVAN', 'TANEY',
'TEXAS', 'VERNON', 'WARREN', 'WASHINGTON', 'WAYNE', 'WEBSTER',
'WORTH', 'WRIGHT', 'WYANDOTTE']




function Probe(props) {
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = React.useState(last_week);
	const [endDate, setEndDate] = React.useState(today);
	const [travel, setTravel] = useState(1);
	const [speed, setSpeed] = useState(1);
	const [averageSpeed, setAverageSpeed] = useState(0);
	const [referenceSpeed, setReferenceSpeed] = useState(1);
	// const [county, setCounty] = useState(0);
	const [countys, setCountys] = useState(['ALL']);
	const [tt_value,setTt_value] = useState(1)
	const [agg_interval, setAggInterval] = useState(60);
	const [fileName, setFileName] = useState('Probe_'.concat(moment().unix()));
	const [queryResults, setQueryResult] = useState([]);
	const [serverResponse, setServerResponse] = useState(null);
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		let timer = null;
		if (loading) {
			timer = setInterval(() => {
				var obj = queryResults[queryResults.length - 1];
				const diff = Math.round(
					Math.abs((new Date() - new Date(obj.querySubmitTime)) / 1000));
				setTimer(diff);
			}, 1000);
		}
		return () => {
			if (queryResults.length) {
				queryResults[queryResults.length - 1].status = 'completed';
			}
			clearInterval(timer);
		};
	},[loading]);

	useEffect(() => {
		if (timer) {
			queryResults[queryResults.length - 1].queryResponseTime = timer;
		}
	}, [timer]);

	useEffect(() => {
		if (serverResponse) {
			queryResults[queryResults.length - 1].url = serverResponse.result;
			queryResults[queryResults.length - 1].status = serverResponse.status;
			setQueryResult(queryResults);
		}
	}, [serverResponse]);

	const onSubmit = () => {
		if ((!travel) && (!speed)&& (!averageSpeed)&& (!referenceSpeed)){
			alert('Please select atleast one field');
			return;
		}

		// if (![travel, speed, averageSpeed, referenceSpeed].includes(true)) {
		//   alert('Please select atleast one field');
		//   return;
		// }
		if (fileName.trim().length === 0) {
		  alert('Please enter file name.');
		  return;
		}
		
		setLoading(true);
		var results = [...queryResults, {
			status: 'progress',
			querySubmitTime: new Date().toISOString(),
			queryResponseTime: 0,
			url: '',
		}];
		setQueryResult(results);
		let starttime = new Date()
		fetch(
			`http://127.0.0.1:8000/probe/StartDate/${startDate}/EndDate/${endDate}/Speed/${speed}/TravelTime/${travel}/AverageSpeed/${averageSpeed}/ReferenceSpeed/${referenceSpeed}/County/${countys}/AggInterval/${agg_interval}/TtValue/${tt_value}/FileName/${fileName}`)
		//   `http://127.0.0.1:8000/api/extensions/get/Startdate/${startDate}:00/EndDate/${endDate}:00/TravelTime/${travel}/Speed/${speed}/AverageSpeed/${averageSpeed}/ReferenceSpeed/${referenceSpeed}/County/${county}/Filename/${fileName}`)
		.then(res => {
		  return res.json();
		}).then(response => {
			// console.log('server response!!!!!!!!!!');
			console.log(response);
			console.log(Math.abs((new Date(response[2]) - starttime) / 1000));
			console.log(Math.floor(Math.abs((new Date() - starttime) / 1000)).toString())
			// setQueryResponse(Math.abs((new Date() - starttime) / 1000))
			var rstval = Math.abs((new Date(response[2]) - starttime) / 1000).toString()
			

		    setLoading(false);
			setServerResponse({
				result: response[0],
				status: 'completed',
				filename:response[1],
			});

			// let messageRef = firebase.database().ref('messages')
			let uuid = firebase.auth().currentUser.uid
			let unixTime = new Date().getTime().toString()
			// let responseTime = Math.floor(query_respond).toString()
			// console.log(Math.floor(query_respond).toString())
			// let responseTime = results.queryResponseTime.toString()
			
			const messageRef = firebase.firestore().collection('downloads')
			// console.log(serverResponse)
			// console.log(serverResponse.responseTime)

			messageRef.doc('probe').collection(uuid).doc(unixTime).set({'location':response[0], 
			'uid':uuid,'filename':response[1], 'queryDate':unixTime,'type':'probe',
			'queryResponse':rstval})
		
		 })
		 .catch(err => {
			console.log('error!!!!!!!');
			console.log(err);
		});
	}

	const download = url => {
		window.open(url);
	}

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
		  if (options[i].selected) {
			value.push(options[i].value);
		  }
		}
		setCountys(value);
		// console.log(countys)
	};

	const handleChangeAgg = (event) => {
		setAggInterval(event.target.value);
	  };
	const handleTtValue = (event) => {
		setTt_value(event.target.value);
	};
	  


	return (
		
		<>
		
			<SimpleHeader name="Form elements" parentName="Forms" />

			<Container className="mt--6" fluid>
				<form className="cus_container">
					<div className="heading probe_clr">
						Query Probe Database
					</div>
					<div className="timing">
						<div className="dates">
							<span>Start Date &amp; Time</span>
							<TextField
								id="datetime"
								type="datetime-local"
								defaultValue={startDate}
								InputProps={{ disableUnderline: true }}
								onChange={(e) => {
									setStartDate(e.target.value);
								}}
							/>
						</div>
						<div className="dates">
							<span>End Date &amp; Time</span>
							<TextField
								id="datetime-local"
								type="datetime-local"
								defaultValue={endDate}
								InputProps={{ disableUnderline: true }}
								onChange={(e) => {
									setEndDate(e.target.value);
								}}
							/>
						</div>
					</div>

					<div className="checkboxes">
						<p>Data Attributes</p>
						<FormGroup className="checkbox-group">
							<FormControlLabel
								control={
									<Checkbox
										checked={travel}
										name="Travel Time"
										onChange={(e) => setTravel(e.target.checked)}
									/>
								}
								label="Travel Time"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={speed}
										name="Speed"
										onChange={(e) => setSpeed(e.target.checked)}
									/>
								}
								label="Speed"
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="Average Speed"
										onChange={(e) => setAverageSpeed(e.target.checked)}
									/>
								}
								label="Average Speed"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={referenceSpeed}
										name="Reference Speed"
										onChange={(e) => setReferenceSpeed(e.target.checked)}
									/>
								}
								label="Reference Speed"
							/>
						</FormGroup>
					</div>

					<div className="travel-time">
						<FormControl>
							<InputLabel shrink htmlFor="travel-time-id">
								Units for Travel Time
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={tt_value}
								onChange={handleTtValue}
							>
								<MenuItem value={1}>minutes</MenuItem>
								<MenuItem value={60}>seconds</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div className="aggregation-interval">
						<FormControl>
							<InputLabel shrink htmlFor="aggregation-interval">
								County
							</InputLabel>
							<Select 
								multiple
								native
								value={countys}
								onChange={handleChangeMultiple}
								inputProps={{
									id: 'select-multiple-native',
								}}
							>
								{counties.map((name) =>(
									<option key={name} value={name}>
										{name}
									</option>
								))}
							</Select>
						</FormControl>
					</div>

					<div className="aggregation-interval">
						<FormControl>
							<InputLabel shrink htmlFor="aggregation-interval">
								Aggregation Interval
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={agg_interval}
								onChange={handleChangeAgg}
							>
								<MenuItem value={60}>60 minutes</MenuItem>
								<MenuItem value={30}>30 minutes</MenuItem>
								<MenuItem value={15}>15 minutes</MenuItem>
								<MenuItem value={5}>5 minutes</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div className="file-name">
						<TextField
							id="file-name"
							label="File Name"
							type="text"
							defaultValue={fileName}
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(e) => setFileName(e.target.value)}
						/>
					</div>

					<div className="button">
						<Button
							className="probe_clr"
							variant="contained"
							// disabled={loading}
							disbled={false}
							onClick={onSubmit}>
			  				SUBMIT QUERY
						</Button>
					</div>
				</form>
			</Container>

			<Container className="mt--10" fluid>

                <Card>
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Query Results</h3>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col" style={{backgroundColor: '#172b4d', color: '#fff'}}>
                          Status
                        </th>
                        <th scope="col" style={{backgroundColor: '#172b4d', color: '#fff'}}>
                          Downloads and Reports
                        </th>
                        <th scope="col" style={{backgroundColor: '#172b4d', color: '#fff'}}>
                          Query Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
						{queryResults.length ? (
							queryResults.map((result, index) => {
								return <tr key={index}>
								<td>
									<div className="button">
										<Button
											className="probe_clr"
											variant="contained"
											disabled={
												result.status === 'progress' ? true : false
											}
											onClick={() => download(result.url)}>
											{
												result.status === 'progress' ? 'Downloading' : 'Download Ready'
											}
										</Button>
									</div>
								</td>
								<td className="budget">
									Query returned in {result.queryResponseTime} seconds
								</td>
								<td>
									{ 
										moment(result.querySubmitTime).format(
											'MMM DD, YYYY hh:mm A')
									}
								</td>
							</tr>
							})
						) : (
							<tr>
								<td colSpan="3" style={{textAlign: 'center', fontSize: 20}}>
									Data not found.
								</td>
							</tr>
						)}
                    </tbody>
                  </Table>
                </Card>
			</Container>
		</>
	);
}

export default Probe;
