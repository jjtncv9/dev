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
	FormControl,
	InputLabel,
	NativeSelect,
	TextField,
} from "@material-ui/core";
import moment from 'moment';

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

function Detector(props) {
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = React.useState(today);
	const [endDate, setEndDate] = React.useState(today);
	const [fileName, setFileName] = useState('Detector');
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
		fetch(
		  `http://127.0.0.1:8000/detector/`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
				startDate: `${startDate}:00`,
				endDate: `${endDate}:00`,
				fileName
			  })
		  })
		.then(res => {
		  return res.json();
		 }).then(response => {
		   setLoading(false);
		   setServerResponse({
			result: response,
			status: 'completed'
		   });
		  // window.open(results);
			
		  // if (Array.isArray(results)) {
		  //   // create csv file here
	
		  //   var csv = `${Object.keys(results[0]).join('\t')}\n`;
		  //   results.forEach(function(row) {
		  //     csv += Object.values(row).join('\t');
		  //     csv += "\n";
		  //   });
		  //   var hiddenElement = document.createElement('a');
		  //   hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
		  //   hiddenElement.target = '_blank';
		  //   hiddenElement.download = 'probe.csv';
		  //   hiddenElement.click();
		  //   hiddenElement.remove();
		  // }
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
					<div className="heading detector_clr">
						Query Detector Database
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

					<div className="travel-time">
						<FormControl>
							<InputLabel shrink htmlFor="travel-time-id">
								Units for Travel Time
							</InputLabel>
							<NativeSelect
								inputProps={{
									name: "Travel Time",
									id: "travel-time-id",
								}}
							>
								<option value="minutes">minutes</option>
								<option value="seconds">seconds</option>
							</NativeSelect>
						</FormControl>
					</div>

					<div className="aggregation-interval">
						<FormControl>
							<InputLabel shrink htmlFor="aggregation-interval">
								Aggregation Interval
							</InputLabel>
							<NativeSelect
								inputProps={{
									name: "Aggregation Interval",
									id: "aggregation-interval",
								}}
							>
								<option value="60">60 min</option>
								<option value="30">30 min</option>
								<option value="15">15 min</option>
								<option value="5">5 min</option>
							</NativeSelect>
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
							className="detector_clr"
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
                    <tbody className="list">
						{queryResults.length ? (
							queryResults.map((result, index) => {
								return <tr key={index}>
								<td>
									<div className="button">
										<Button
											className="detector_clr"
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

export default Detector;
