
const bcrypt = require('bcrypt');
const { request } = require('express');

const Pool = require('pg').Pool;

const pool = new Pool({
    host: 'localhost',
    port: 9000,
    user: 'postgres',
    password: 'root',
    database: 'test'
});

const creatEventsOccupants = (request, response) => {
    const { id, title, details, date, from_time, to_time, location, status, cancel_reason, denied_reason, building_id, created_by, creator_id, secretary_notes } = request.body
    console.log({ location });

    pool.query('INSERT INTO eleva.events_details ( id,title,details,date,from_time,to_time,location,status,cancel_reason,denied_reason,building_id,created_by,creator_id,secretary_notes ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
        [id, title, details, date, from_time, to_time, location, status, cancel_reason, denied_reason, building_id, created_by, creator_id, secretary_notes], (error, result) => {
            if (error) {
                response.status(400).json({
                    status: "Error",
                    reCode: 400,
                    msg: "Event Not Created Sucessfully",
                    isExist: false
                })
                return
            }
            response.status(200).json({
                status: "Sucess",
                reCode: 200,
                response: `${title}`,
                msg: `Event Created successfully`
            });
        })
}

const getEvents = (request, response) => {
    const id = request.params.id

    pool.query('select * from eleva.events_details where id = $1', [id], (error, result) => {
        if (error) {
            response.status(400).json({
                status: "Error",
                reCode: 400,
                msg: "Request Not Available",
                isExist: false
            })
            return
        }
        if (!result.rows.length) {
            response.status(200).json({
                status: "Sucess",
                reCode: 200,
                response: `${id}`,
                msg: "Event Not Exisit",
                isExist: false
            })
            return
        }
        response.status(200).json({
            status: "Sucess",
            reCode: 200,
            msg: "Events Available",
            isExist: true,
            response: result.rows
        })

    })

}



const getAllEvents = (request, response) => {
    const date = request.params.date
    const id = request.params.id
    const created_by = request.params.created_by
    const user_id = request.params.user_id
    const secretary_id = request.params.secretary_id
    const status = request.params.status + ''
    pool.query('select * from eleva.events_details where building_id = $1 and date >= $2 and status = $3', [id, date, status], (error, result) => {
        if (error) {
            response.status(400).json({
                status: "Error",
                reCode: 400,
                msg: "Request Not Available",
                isExist: false
            })
            return
        }
        if (!result.rows.length) {
            response.status(200).json({
                status: "Sucess",
                reCode: 200,
                response: `${date}`,
                msg: "Events Not Available",
                isExist: false
            })
            return
        }
        if (created_by == 'user') {
            pool.query('select * from eleva.occupants_details where user_id = $1', [user_id], (error, res) => {
                if (error) {
                    response.status(400).json({
                        status: "Error",
                        reCode: 400,
                        msg: "Request Not Available",
                        isExist: false
                    })
                    return;
                }

                response.status(200).json({
                    response: res.rows + response.status(200).json({
                        status: "Sucess",
                        reCode: 200,
                        msg: "Events Available",
                        isExist: true,
                        response: result.rows
                    })
                })
            })
        } else if (created_by == 'secretary') {
            pool.query('select * from eleva.secretary_details where secretary_id = $1', [secretary_id], (error, res) => {
                if (error) {
                    response.status(400).json({
                        status: "Error",
                        reCode: 400,
                        msg: "Request Not Available",
                        isExist: false
                    })
                    return
                }
                response.status(200).json({
                    response: res.rows + response.status(200).json({
                        status: "Sucess",
                        reCode: 200,
                        msg: "Events Available",
                        isExist: true,
                        response: result.rows
                    })
                })
            })
        }
    })
}

const deleteEvent = (request, response) => {
    const id = request.params.id;

    pool.query('DELETE FROM eleva.events_details WHERE id = $1', [id], (error, result) => {
        if (error) {
            response.status(400).json({
                status: "Error",
                reCode: 400,
                msg: "Not Deleted Sucessfully",
                isExist: false
            })
            return
        }
        response.status(200).json({
            status: "sucess",
            reCode: 200,
            response: `${id}`,
            Msg: 'Event Deleted Sucessfully'
        })
    })
}

const updateEventStatus = (request, response) => {

    const { id, denied_reason, secretary_notes, status, cancel_reason } = request.body

    if (status == 'accepted') {
        pool.query('update eleva.events_details set secretary_notes = $1, status = $2 where id = $3', [secretary_notes, status, id], (error, result) => {
            if (error) {
                response.status(400).json({
                    status: false,
                    reCode: 400,
                    msg: "Event Not Updated"
                })
                return
            }
            response.status(200).json({
                status: true,
                reCode: 200,
                msg: `Event Accepted`
            })
        })
    } else if (status == 'rejected') {
        pool.query('update eleva.events_details set status = $1,  denied_reason = $2 where id = $3', [status, denied_reason, id], (error, result) => {
            if (error) {
                response.status(400).json({
                    status: false,
                    reCode: 400,
                    msg: "Event Not Updated"
                })
                return
            }
            response.status(200).json({
                status: true,
                reCode: 200,
                msg: `Event Denied`
            })
        })
    } else if (status == 'cancelled') {
        pool.query('update eleva.events_details set status = $1, cancel_reason = $2 where id = $3', [status, cancel_reason, id], (error, result) => {
            if (error) {
                return response.status(400).json({
                    status: false,
                    reCode: 400,
                    msg: "Event Not Updated"
                })
            }
            response.status(200).json({
                status: true,
                reCode: 200,
                msg: `Event Cancelled`
            })
        })
    }
}

const updateEventDetails = (request, response) => {

    const { title, details, date, from_time, to_time, location, id } = request.body
    console.log({ location });

    pool.query('update eleva.events_details set title = $1,  details = $2,date = $3,from_time = $4, to_time = $5, location = $6 where id = $7', [title, details, date, from_time, to_time, location, id], (error, result) => {
        if (error) {
            response.status(400).json({
                status: false,
                reCode: 400,
                msg: "Event Not Updated"
            })
            return
        }
        response.status(200).json({
            status: true,
            reCode: 200,
            msg: `Event updated successfully`
        })
    })
}



module.exports = {
    creatEventsOccupants,
    getEvents,
    deleteEvent,
    getAllEvents,
    updateEventStatus,
    updateEventDetails
}
