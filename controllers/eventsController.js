import Event from "../model/Event.js";

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().exec();
    if (!events)
      return res.status(404).json({ message: "No events found." }); // 404 Not Found
    await res.json(events);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const createNewEvent = async (req, res) => {
    try {
      const newEvent = req.body;
  
      if (!newEvent?.title || !newEvent?.start || !newEvent?.end) {
        return res
          .status(400)
          .json({ message: "Event title, start and end are required" });
      }
  
      const result = await Event.create({
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
      });
  
      res.status(201).json(result);
    } catch (error) {
      res.status(500).send("Error " + error);
    }
  };

  
const updateEvent = async (req, res) => {
    try {
      const currentEvent = req.body;
      const currentEventID = currentEvent?.id;
  
      if (!currentEventID) {
        return res.status(400).json({ message: "ID parameter is required." });
      }
  
      const foundEvent = await Event.findOne({ _id: currentEventID }).exec();
      if (!foundEvent) {
        return res
          .status(404)
          .json({ message: `No event matches ID ${currentEventID}.` }); // 404 Not Found
      }
      if (currentEvent.title) foundEvent.title = currentEvent.title;
      if (currentEvent.start) foundEvent.start = currentEvent.start;
      if (currentEvent.end) foundEvent.end = currentEvent.end;
  
      const result = await foundEvent.save();
  
      res.json(result);
    } catch (error) {
      res.status(500).send("Error " + error);
    }
  };
  
  
const deleteEvent = async (req, res) => {
    try {
      const currentEventID = req?.params?.id;
  
      if (!currentEventID)
        return res.status(400).json({ message: "Event ID required." });
  
      const foundEvent = await Event.findOne({ _id: currentEventID }).exec();
  
      if (!foundEvent) {
        return res
          .status(404)
          .json({ message: `No event matches ID ${currentEventID}.` }); // 404 Not Found
      }
  
      const result = await foundEvent.deleteOne();
  
      res.json(result);
    } catch (error) {
      res.status(500).send("Error " + error);
    }
  };

  export default { getAllEvents, createNewEvent, updateEvent, deleteEvent };