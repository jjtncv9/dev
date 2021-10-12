import React, { useState, useEffect } from "react";
// reactstrap components
import {
	Card,
  	CardHeader,
	Container,
	Table
} from "reactstrap";

// import DateTimePicker from '@material-ui/lab/DateTimePicker';

import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	TextField,
} from "@material-ui/core";
import moment from 'moment';
import {firebase} from '../../../auth/FirebaseAuth'
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

function WazeIncidents() {
	const [loading, setLoading] = useState(false);
	const [start_date, setStartDate] = React.useState(today);
	const [end_date, setEndDate] = React.useState(today);
	const [majorAccident, setMajorAccident] = useState(0);
	const [minorAccident, setMinorAccident] = useState(0);
	const [construction, setConstruction] = useState(0);
	const [carStopped, setCarStopped] = useState(0);
	const [jam, setJam] = useState(0);
	const [roadClosed, setRoadClosed] = useState(0);
	const [filename, setFileName] = useState('WazeIncident'.concat(moment().unix()));
	const [queryResults, setQueryResult] = useState([]);
	const [blogs,setBlogs]=useState([]);
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
/*
	useEffect(() =>{
		firebase.auth().onAuthStateChanged((user) =>{

			// console.log(user)
			const response=firebase.firestore().collection('downloads').doc('transcoreIncidents').collection(user.uid);
			response.get().then(snapshot=>{
				// console.log(snapshot)
				snapshot.forEach((doc) =>{
					// console.log(doc.data())
					setBlogs([...blogs,doc.data()])
				})
			})

		})
		// console.log(blogs)

	},[])*/
	useEffect(() =>{
		firebase.auth().onAuthStateChanged((user) =>{

			// console.log(user)
			const response=firebase.firestore().collection('downloads').doc('transcoreIncidents').collection(user.uid);
			response.get().then(snapshot=>{
				// console.log(snapshot)
				snapshot.forEach((doc) =>{
					// console.log(doc.data())
					setBlogs([...blogs,doc.data()])
				})
			})

		})
		// console.log(blogs)

	},[])


	const onSubmit = () => {
		if (![majorAccident, minorAccident, construction, carStopped, jam, roadClosed].includes(true)) {
		  alert('Please select atleast one field');
		  return;
		}
		if (filename.trim().length === 0) {
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
		  `http://127.0.0.1:8000/waze/incident/StartDate/${start_date}/EndDate/${end_date}/MajorAccident/${majorAccident}/MinorAccident/${minorAccident}/Construction/${construction}/CarStopped/${carStopped}/Jam/${jam}/RoadClosed/${roadClosed}/FileName/${filename}`)
		.then(res => {
		  return res.json();
		 }).then(response => {
			var rstval = Math.abs((new Date(response[2]) - starttime) / 1000).toString()
		   setLoading(false);
		   setServerResponse({
			result: response[0],
			status: 'completed',
			filename:response[1],
		   });
		//    window.open(results);
			let uuid = firebase.auth().currentUser.uid
			let unixTime = new Date().getTime().toString()

			const messageRef = firebase.firestore().collection('downloads')

			messageRef.doc('wazeIncidents').collection(uuid).doc().set({'location':response[0], 
			'uid':uuid,'filename':response[1], 'queryDate':unixTime,'type':'wazeIncidents',
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

	return (
		<>
			<SimpleHeader name="Form elements" parentName="Forms" />

			<Container className="mt--6" fluid>
				<form className="cus_container">
					<div className="heading waze_incidents_clr">
						Query WazeIncident Database
					</div>
					<div className="timing">

						<div className="dates">
							<span>Start Date &amp; Time</span>
							<TextField
								id="datetime"
								type="datetime-local"
								defaultValue={start_date}
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
								defaultValue={end_date}
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
										name="major-accidents"
										onChange={(e) => setMajorAccident(e.target.checked)}
									/>
								}
								label="Major Accidents"
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="minor-accidents"
										onChange={(e) => setMinorAccident(e.target.checked)}
									/>
								}
								label="Minor Accidents"
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="construction"
										onChange={(e) => setConstruction(e.target.checked)}
									/>
								}
								label="Construction"
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="car-stopped"
										onChange={(e) => setCarStopped(e.target.checked)}
									/>
								}
								label="Car Stopped"
							/>							
						</FormGroup>

						<FormGroup className="checkbox-group w-50">
							<FormControlLabel 
								control={
									<Checkbox
										name="jam"
										onChange={(e) => setJam(e.target.checked)}
									/>
								} 
								label="Jam" 
							/>
							<FormControlLabel 
								control={
									<Checkbox
										name="road-closed"
										onChange={(e) => setRoadClosed(e.target.checked)}
									/>
								} 
								label="Road Closed" 
							/>							
						</FormGroup>						
					</div>

					<div className="file-name">
						<TextField
							id="file-name"
							label="File Name"
							type="text"
							defaultValue={filename}
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(e) => setFileName(e.target.value)}
						/>
					</div>

					<div className="button">
						<Button
							className="waze_incidents_clr"
							variant="contained"
							disabled={loading}
							onClick={onSubmit}>SUBMIT QUERY</Button>
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
						{queryResults.map((result, index) => {
								return <tr key={index}>
								<td>
									<div className="button">
										<Button
											className="waze_incidents_clr"
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
									Query returned in {
									result.queryResponseTime > 60 ? result.queryResponseTime / 60 :  result.queryResponseTime} seconds
								</td>
								<td>
									{ 
										moment(result.querySubmitTime).format(
											'MMM DD, YYYY hh:mm A')
									}
								</td>
							</tr>
							})}
						<FbData>
						</FbData>
                  </Table>
                </Card>
			</Container>
		</>
	);
}

let arr = []
	firebase.auth().onAuthStateChanged((user) =>{
	firebase.firestore().collection('downloads').doc('wazeIncidents').collection(user.uid).get().then((snapshot) => {
			let changes = snapshot.docChanges()
			changes.forEach(change => {
				if(change.type == "added"){
					console.log("Here")
					arr.push(change.doc)
				}
			})

		})

	})
function FbData(props) {
	const download = url => {
		window.open(url);
	}

	const arrItems = arr.map((doc, index) => 
	<tr key={index}>
		<td>
			<div className="button">
				<Button
					className="waze_incidents_clr"
					variant="contained"
					onClick={() => download(doc.data().location)}>
						{
							"Download Ready"
						}
				</Button>
			</div>
		</td>
		<td className="budget">
			Query returned in {doc.data().queryResponse} seconds
		</td>
		<td>
			{ 
				moment(parseInt(doc.data().queryDate)).format(
					'MMM DD, YYYY hh:mm A')
			}
		</td>
	</tr>)

	return (<tbody className="list">
		{arr.length ? (
			(arrItems) 
		) : (
			<tr>
				<td colSpan="3" style={{textAlign: 'center', fontSize: 20}}>
					Data not found.
				</td>
			</tr>
		)
		}
		</tbody>)
}
export default WazeIncidents;
