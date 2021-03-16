module.exports = {
    getTimeRemaining : function Date_getTimeRemaining(that) {
      let delta = that / 1000;
      const hours = Math.floor(delta / 60 / 60) % 24;
      const minutes = Math.floor((delta -= hours / 60 / 60) / 60) % 60;
      const seconds = Math.floor((delta -= minutes * 60)) % 60;
      
      const diff = {hours, minutes, seconds};

      let output = '';
      if (diff.hours > 1)
        output += ` ${diff.hours} heures`;
      else if (diff.hours)
        output += ` ${diff.hours} heure`;
      if (diff.minutes > 1)
        output += ` ${diff.minutes} minutes`;
      else if (diff.minutes)
        output += ` ${diff.minutes} minute`;
      if (diff.seconds > 1)
        output += ` ${diff.seconds} secondes`;
      else if (diff.seconds)
        output += ` ${diff.seconds} seconde`;
  
      return output.slice(1);
    },

    isMention : function Util_isMention(str) {
      const TEST = /<@!*([0-9]*)>/

      return TEST.test(str) ? TEST.exec(str)[1] : undefined;
    }
}