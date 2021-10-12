import React, { useState, useEffect } from "react";
// reactstrap components
import {
	Card,
  	CardHeader,
	Container,
	Table,
} from "reactstrap";

// import DateTimePicker from '@material-ui/lab/DateTimePicker';

import {
	Button,
	Checkbox,
	FormControlLabel,
	FormControl,
	FormGroup,
	InputLabel,
	TextField,
	Select,
	MenuItem
} from "@material-ui/core";
import moment from 'moment';
import SimpleHeader from "components/Headers/SimpleHeader.js";
import {firebase} from '../../../auth/FirebaseAuth'


var incident_types_all = [
	'ALL','ACCIDENTS','ROADWORK','UTILITY WORK','ROAD CLOSED','DEBRIS','VEHICLE FIRE',
	'EMERGENCY VEHICLES','ER VEHICLE','MOVING ROADWORK','STALLED VEHICLE'
]

var counties_all = ['ALL','ST. LOUIS','WARREN','STE. GENEVIEVE','JEFFERSON','PERRY',
'LINCOLN','ST. CHARLES','ST. LOUIS CITY','FRANKLIN']

const dateArr = new Date().toISOString().split(':', 2);
const today = dateArr[0] + ":" + dateArr[1];

var date = new Date();
date.setDate(date.getDate() - 7);
const last_weekArr = date.toISOString().split(':', 2);
const last_week = last_weekArr[0] + ":" + last_weekArr[1];

function Incidents(props) {
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = React.useState(last_week);
	const [endDate, setEndDate] = React.useState(today);
	// const [allIncidents,setAllincidents] = useState(1);
	const [counties, setCounties] = useState(['ALL']);
	// const [construction, setConstruction] = useState(0);
	// const [utility, setUtility] = useState(0);
	const [incident_types, setIncidentypes] = useState(['ALL']);
	const [blogs,setBlogs]=useState([])

	// const [roadclosure, setRoadclosed] = useState(0);
	const [fileName, setFileName] = useState('Incidents_'.concat(moment().unix()));
	const [queryResults, setQueryResult] = useState([]);
	const [serverResponse, setServerResponse] = useState(null);
	const [timer, setTimer] = useState(0);
	// const uuid = firebase.auth().currentUser.uid
	// console.log(firebase.auth().currentUser.uid)


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

	// useEffect(() => {
	// 	fetchBlogs();
	//   }, [])

	// const fetchBlogs=async()=>{
	// 	// const uuid = firebase.auth().currentUser.uid
	// 	const response=firebase.firestore().collection('downloads').doc('transcoreIncidents').collection('xfHAePKCECPPtuBwk9CQRSr8GQO2')		
	// 	// const response=firebase.firestore().collection('downloads');
	// 	const data=await response.get();
	// 	data.docs.forEach(item=>{
	// 		setBlogs([...blogs,item.data()])
	// 	})
	// }

	// useEffect(() =>{
	// 	fetchBlogs_()
	// })

	// const fetchBlogs_=async()=>{

	// 	firebase.auth().onAuthStateChanged((user) =>{
	// 		if (user) {
	// 			var uuid = firebase.auth().currentUser.uid
	// 			// console.log(uuid)
	// 			const response=firebase.firestore().collection('downloads').doc('transcoreIncidents').collection(uuid);
	// 			response.get().then(snapshot=>{
	// 				snapshot.forEach((doc) =>{
	// 					// console.log(doc.data())
	// 					setBlogs([...blogs,doc.data()])
	// 				})
	// 			})
	// 		}
	// 	})
	// }
	
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

		// const fetchBlogs_=async()=>{
	// 	firebase.auth().onAuthStateChanged((user) =>{
	// 		if (user) {
	// 			var uuid = firebase.auth().currentUser.uid
	// 			// console.log(uuid)
	// 			const response=firebase.firestore().collection('downloads').doc('transcoreIncidents').collection(uuid);
	// 			response.get().then(snapshot=>{
	// 				snapshot.forEach((doc) =>{
	// 					// console.log(doc.data())
	// 					setBlogs([...blogs,doc.data()])
	// 				})
	// 			})
	// 		}
	// 	})
	// }


	const onSubmit = () => {
		if ((incident_types.length==0) && (counties.length==0)){
			alert('Please select atleast one field');
			return;
		}
		// if ((!accident) && (!construction)&& (!utility)&& (!roadclosure)){
		// 	alert('Please select atleast one field');
		// 	return;
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
			// `http://127.0.0.1:8000/transcore/incident/StartDate/${startDate}/EndDate/${endDate}/Accident/${accident}/Construction/${construction}/Utility/${utility}/RoadClosed/${roadclosure}/FileName/${fileName}`, {
		  `http://127.0.0.1:8000/transcore/incident/StartDate/${startDate}/EndDate/${endDate}/IncidenTypes/${incident_types}/County/${counties}/FileName/${fileName}`, {
		  })
		.then(res => {
		  return res.json();
		 }).then(response => {
			//  console.log(response)
			 var rstval = Math.abs((new Date(response[2]) - starttime) / 1000).toString()
		   setLoading(false);
		   setServerResponse({
			result: response[0],
			status: 'completed',
			filename:response[1],
		   });

			let uuid = firebase.auth().currentUser.uid
			let unixTime = new Date().getTime().toString()
			
			const messageRef = firebase.firestore().collection('downloads')

			messageRef.doc('transcoreIncidents').collection(uuid).doc().set({'location':response[0], 
			'uid':uuid,'filename':response[1], 'queryDate':unixTime,'type':'transcoreIncidents',
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
		setIncidentypes(value);
		
	};

	const handleChangeCounties = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
		  if (options[i].selected) {
			value.push(options[i].value);
		  }
		}
		setCounties(value);
		// console.log(counties)
	};

	return (
		<>
			<SimpleHeader name="Form elements" parentName="Forms" />

			<Container className="mt--6" fluid>
				<form className="cus_container">
					<div className="heading incidents_clr">
						Query Incidents Database
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

					
					<div className="aggregation-interval">
						<FormControl>
							<InputLabel shrink htmlFor="aggregation-interval">
								Incident Types
							</InputLabel>
							<Select 
								multiple
								native
								value={incident_types}
								onChange={handleChangeMultiple}
								inputProps={{
									id: 'select-multiple-native',
								}}
							>
								{incident_types_all.map((name) =>(
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
								County
							</InputLabel>
							<Select 
								multiple
								native
								value={counties}
								onChange={handleChangeCounties}
								inputProps={{
									id: 'select-multiple-native',
								}}
							>
								{counties_all.map((name) =>(
									<option key={name} value={name}>
										{name}
									</option>
								))}
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
							className="incidents_clr"
							variant="contained"
							disabled={loading}
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
						{queryResults.map((result, index) => {
								return <tr key={index}>
								<td>
									<div className="button">
										<Button
											className="incidents_clr"
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
	firebase.firestore().collection('downloads').doc('transcoreIncidents').collection(user.uid).get().then((snapshot) => {
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
					className="incidents_clr"
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
	

export default Incidents;


