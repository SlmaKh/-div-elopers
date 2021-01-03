import { Container } from "@material-ui/core";
import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import Schedule from '../ac/Schedule_Handler/Schedule';
import AccidentalLeaveRequest from './accidentalLeaveRequest.js';
import AnnualLeaveRequest from './annualLeaveRequest.js';
import ChangeDayOffRequest from './changeDayOffRequest.js';
import CompensationLeaveRequest from './compensationLeaveRequest.js';
import ManageCourseInstructors from './ManageCourseInstructors.js';
import MaternityLeaveRequest from './maternityLeaveRequest.js';
import SickLeaveRequest from './sickLeaveRequest.js';
import ViewStaffProfiles from './viewStaffProfiles.js';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}


const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

const requestDepartmentCourses = async () => {
    const departmentCourses = await axios.get('/hod/getDepartmentCourses');
    return departmentCourses.data;
}

const getAllAcademicMembers = async () => {
    const res = await axios.get('/hod/getAllAcademicMembers');
    return res.data;
}


const getAcademicMembersTable = async () => {
    const res = await axios.get('/hod/getAcademicMembersTable');
    return res.data;
}

const requestStaffProfiles = async (filter = "none", obj = {}) => {
    if (filter == "none") {
        const res = await axios.get('/hod/viewDepartmentMembers');
        return res.data;

    } else if (filter == "course") {
        const res = await axios.get(`/hod/viewDepartmentMembersByCourse/${obj.courseID}`);
        return res.data;

    } else if (filter == "staffMember") {
        const res = await axios.get('/hod/viewDepartmentMembers');
        const out = res.data.filter((mem) => { return mem.ID.split("-")[1] == obj.ID });
        return out;

    }
}

const drawerWidth = 240;

const requestAllRequests = async () => {
    const res = await axios.get('/hod/viewAllRequests');
    return res.data;

}

const requestSchedule = async () => {
    const schedule = await axios.get('ac/viewSchedule');
    return schedule.data;
}

const styles = (theme) => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        staffProfiles: [],
        hodProfile: {},
        requests: [],
        requestsFirstTime: true,
        isAppBarShift: false,
    }
    updateRequestStaffProfile = async (filter = "none", obj = {}) => {
        const profiles = await requestStaffProfiles(filter, obj);
        this.setState({ staffProfiles: profiles });
        return profiles;
    }

    updateRequests = async (type = "", requestID = -1, newStatus = "") => {
        if (this.state.requestsFirstTime || requestID == -1) {
            const requests = await requestAllRequests();
            this.setState({ requests: requests });

            this.setState({ requestsFirstTime: false })
            return requests;
        } else {
            const allRequests = this.state.requests;
            if (!allRequests.find((req) => { return req.type == type })) return [];
            let typeRequests = allRequests.find((req) => { return req.type == type }).requests;
            for (const request of typeRequests) {
                if (request.ID == requestID) {
                    request.status = newStatus;
                }

            }
            this.setState({ requests: allRequests });
            return allRequests;
        }

    }

    updateHODProfile = async () => {
        this.setState({ hodProfile: await requestUserProfile() });
    }

    setComponentInMain = async (event) => {
        if (event == "profile") {
            this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        } else if (event == "attendance") {
            this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods()}
                    setComponentInMain={this.setComponentInMain}
                />
            });
        } else if (event == "schedule") {
            console.log("schedule")
            this.setState({
                componentInMain: <Schedule
                    schedule={await requestSchedule()}
                />
            });
        }
        else if (event == "manageCourseInstructors") {
            console.log("I am in event course")

            this.setState({
                componentInMain: <ManageCourseInstructors
                    courses={await requestDepartmentCourses()}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAllAcademicMembers()}
                />
            });

        }
        else if (event == "viewStaffProfiles") {
            console.log("I am in event profiles")
            this.setState({
                componentInMain: <ViewStaffProfiles
                    allCourses={await requestDepartmentCourses()}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAcademicMembersTable()}
                    staffProfiles={this.state.staffProfiles}
                    hodProfile={this.state.hodProfile}
                    updateProfiles={this.updateRequestStaffProfile}
                />
            });
        } else if (event == "changeDayOffRequest") {
            console.log(this.state.requests);
            this.setState({
                componentInMain: <ChangeDayOffRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "change day off requests" }).requests}
                />
            });

        } else if (event == "annualLeaveRequest") {
            this.setState({
                componentInMain: <AnnualLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "annual leave requests" }).requests}
                />
            });

        } else if (event == "accidentalLeaveRequest") {
            this.setState({
                componentInMain: <AccidentalLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "accidental leave requests" }).requests}
                />
            });


        } else if (event == "sickLeaveRequest") {
            this.setState({
                componentInMain: <SickLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "sick leave requests" }).requests}
                />
            });

        } else if (event == "maternityLeaveRequest") {
            this.setState({
                componentInMain: <MaternityLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "maternity leave requests" }).requests}
                />
            });

        } else if (event == "compensationLeaveRequest") {
            this.setState({
                componentInMain: <CompensationLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "compensation leave requests" }).requests}
                />
            });

        }
    }

    handleAppBarShift = (event) => {
        this.setState({ isAppBarShift: event });
        console.log(this.state.isAppBarShift)
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            this.setState({ isLoggedIn: 2 });

        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }

        await this.updateRequestStaffProfile();
        await this.updateHODProfile();
    }

    render() {
        const { classes } = this.props;

        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >
                <Navigation_Bar fromParent={this.setComponentInMain}
                    updateRequestStaffProfile={this.updateRequestStaffProfile}
                    updateRequests={this.updateRequests}
                    handleAppBarShift={this.handleAppBarShift}
                />
                <Container maxWidth="lg" style={{ marginTop: "30px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>
                    {this.state.componentInMain}
                </Container>

            </div>
        )
    }
}

export default withStyles(styles)(HOD);