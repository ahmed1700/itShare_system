const express = require('express');
const router = express.Router();
const { Employee } = require('../models/employees');
const { Branch } = require('../models/branch');
const jwt = require('jsonwebtoken');



router.post('/', async (req, res, next) => {
    try {

        const employee = await Employee.findOne({ email: req.body.email, password: req.body.password });
        if (!employee) {
            return res.send({ result: false, message: 'invalid email or password' });
        };
        let { ip } = req.body
        if (employee.role != 'Admin') {
            const branch = await Branch.findOne({ branchID: employee.branchID });
            if (ip !== branch.ip && ip !== branch.ip2 && ip !== branch.ip3) {
                return res.send({ result: false, message: 'Please Sign In From the branch' });
            }
        }
        const token = jwt.sign({ employeeID: employee.employeeID, branchID: employee.branchID, role: employee.role, email: employee.email, fullNameEnglish: employee.fullNameEnglish }, '123456');
        res.header('Authorization', token).send({
            result: true, data: {
                'employeeID': employee.employeeID,
                'fullNameArabic': employee.fullNameArabic,
                'fullNameEnglish': employee.fullNameEnglish,
                'branchID': employee.branchID,
                'role': employee.role,
                'token': token
            }
        });

    } catch (err) {
        next(err);
    }
});


module.exports = router;