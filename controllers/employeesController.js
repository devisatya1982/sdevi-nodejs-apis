import Employee from "../model/Employee.js";

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().exec();
    if (!employees)
      return res.status(404).json({ message: "No employees found." }); // 404 Not Found
    await res.json(employees);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const createNewEmployee = async (req, res) => {
  try {
    const newEmployee = req.body;
    // delete newEmployee.employeeId;

    if (!newEmployee?.employeeName || !newEmployee?.employeeSal) {
      return res
        .status(400)
        .json({ message: "Employee name and salary are required" });
    }

    const result = await Employee.create({
      employeeName: newEmployee.employeeName,
      employeeSal: newEmployee.employeeSal,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const currentEmployee = req.body;
    const currentEmployeeID = req.body._id;

    if (!currentEmployeeID) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const employee = await Employee.findOne({ _id: currentEmployeeID }).exec();
    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${currentEmployeeID}.` }); // 404 Not Found
    }
    if (currentEmployee.employeeName)
      employee.employeeName = currentEmployee.employeeName;
    if (currentEmployee.employeeSal)
      employee.employeeSal = currentEmployee.employeeSal;

    const result = await employee.save();

    res.json(result);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const currentEmployeeId = req?.params?.id;

    if (!currentEmployeeId)
      return res.status(400).json({ message: "Employee ID required." });

    const employee = await Employee.findOne({ _id: currentEmployeeId }).exec();

    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${currentEmployeeId}.` }); // 404 Not Found
    }

    const result = await employee.deleteOne();

    res.json(result);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

export default { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee };
