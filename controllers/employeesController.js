import Employee from '../model/Employee.js';

const getAllEmployees = async (req, res) => {
  try {
    const employees = Employee.find();
    if (!employees)
      return res.status(204).json({ message: "No employees found." });
    await res.json(employees);
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const createNewEmployee = async (req, res) => {
    const newEmployee = req.body;
    delete newEmployee.employeeId;

    if (!newEmployee?.employeeName || !newEmployee?.employeeSal) {
        return res.status(400).json({ 'message': 'Employee name and salary are required' });
    }

    try {
        const result = await Employee.create({
            _id:Date.now(),
            employeeName: newEmployee.employeeName,
            employeeSal: newEmployee.employeeSal
        });

        res.status(201).json(result);
    } catch (err) {
        res.status(500).send("Error " + err);
    }
}

const updateEmployee = async (req, res) => {
    const currentEmployee = req.body;

    if (!currentEmployee._id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: currentEmployee.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${currentEmployee.id}.` });
    }
    if (currentEmployee.employeeName) employee.employeeName = currentEmployee.employeeName;
    if (currentEmployee.employeeSal) employee.employeeSal = currentEmployee.employeeSal;

    const result = await employee.save();

    res.json(result);
}

const deleteEmployee = async (req, res) => {
    const currentEmployee = req.body;

    if (!currentEmployee._id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: currentEmployee._id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${currentEmployee._id}.` });
    }
    const result = await employee.deleteOne();

    res.json(result);
}

const getEmployee = async (req, res) => {
    const currentEmployeeId = Number(req?.params?._id);
    
    if (!currentEmployeeId) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: currentEmployeeId }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${currentEmployeeId}.` });
    }
    res.json(employee);
}

export default {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}