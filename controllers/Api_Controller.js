module.exports = class Api_Controller {

  static getWeekdays(req, res) {
    const weekdays = { weekdays: ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"] };
    res.status(200).json(weekdays);
  }
  
  static getSportsList(req, res) {
    const sportList = { sportList: ["Football", "Voleyball", "Basketball", "Rugby", "Tennis"] };
    res.status(200).json(sportList);
  }
};
