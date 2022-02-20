class App {
  constructor() {
    this.set = new Set();
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    // ex 5월 index = 4 로 표기 된다.
    this.startDate = new Date(this.currentYear, this.currentMonth, 1);
    // 0은 하루를 뺀다.
    // 5월 1일 ~ 5월 31일을 원하면 6월 1일로 만든 후 0을 넣어서 하루를 빼준다.
    this.endDate = new Date(this.currentYear, this.currentMonth + 1, 0);
    this.$row = document.querySelector("#date");
    this.init();
    this.dateDraw(this.startDate, this.endDate);
  }

  // "일", "월", "화", "수", "목", "금", "토"을 그려준다.
  init() {
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const $day = document.querySelector("#day");
    day.forEach((value) => {
      const $span = document.createElement("span");
      $span.classList.add("day");
      $span.textContent = value;
      $day.appendChild($span);
    });
  }

  dateDraw(startObj, endObj) {
    this.prevDraw(startObj);

    for (let i = 1; i <= endObj.getDate(); i++) {
      let $span = this.makeSpan(i, ["date"]);
      $span.yymmdd = this.makeYYmmdd(startObj, i);
      this.$row.append($span);
      this.eventHandler($span);
    }

    this.nextDraw(endObj);

    this.currentYear = startObj.getFullYear();
    this.currentMonth = startObj.getMonth() + 1;

    this.yearDraw();
    this.monthDraw();
    this.yymmddSelector();
    this.dateCheck();
  }

  prevDraw(startObj) {
    const day = startObj.getDay();
    const prevDate = new Date(this.currentYear, this.currentMonth, -day + 1);

    for (let i = 0; i < day; i++) {
      this.$row.append(
        this.makeSpan(`${prevDate.getDate() + i}`, ["date", "space"])
      );
    }
  }

  nextDraw(endObj) {
    const nextDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    for (let i = 0; i < 6 - endObj.getDay() + 7; i++) {
      this.$row.append(
        this.makeSpan(`${nextDate.getDate() + i}`, ["date", "space"])
      );
    }
  }

  makeSpan(value, className) {
    const $span = document.createElement("span");
    $span.classList.add(...className);
    $span.textContent = value;
    return $span;
  }

  yearDraw() {
    document.querySelector(".year").textContent = this.getCurrentYear();
  }

  monthDraw() {
    document.querySelector(".month").textContent = this.getCurrentMonth();
  }

  prevMonth() {
    this.$row.innerHTML = "";
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.endDate.setDate(0);
    this.dateDraw(this.startDate, this.endDate);
  }
  nextMonth() {
    this.$row.innerHTML = "";
    this.startDate.setMonth(this.startDate.getMonth() + 1);
    this.endDate.setDate(1);
    this.endDate.setMonth(this.endDate.getMonth() + 2);
    this.endDate.setDate(0);
    this.dateDraw(this.startDate, this.endDate);
  }

  makeYYmmdd(startObj, date) {
    let yymmdd = startObj.getFullYear();
    let month = startObj.getMonth() + 1;
    month < 10 ? (yymmdd += `/0${month}`) : (yymmdd += `/${month}`);
    date < 10 ? (yymmdd += `/0${date}`) : (yymmdd += `/${date}`);
    return yymmdd;
  }

  getCurrentYear() {
    return this.currentYear;
  }

  getCurrentMonth() {
    return this.currentMonth;
  }

  eventHandler(el) {
    el.addEventListener("click", (e) => {
      const span = e.currentTarget;
      if (span.isClick) {
        span.isClick = false;
        span.classList.remove("click");
        this.set.delete(span.yymmdd);
        this.selectDay();
        return e.preventDefault();
      }

      if (this.set.size < 2) {
        this.set.add(span.yymmdd);
        span.isClick = true;
        span.classList.add("click");
        this.selectDay();
      } else {
        alert("이미 날짜를 선택 했습니다.");
      }
    });
  }

  selectDay() {
    const array = Array.from(this.set)
      .map((x) => {
        const str = x.split("/");
        return new Date(str[0], parseInt(str[1]) - 1, str[2]).getTime();
      })
      .sort((a, b) => a - b)
      .map((x) => {
        const day = new Date(x).toLocaleDateString();
        return day.slice(0, day.lastIndexOf("."));
      })
      .map((x) => {
        const yymmdd = x.split(".");
        return `${yymmdd[0]}년 ${yymmdd[1]}월 ${yymmdd[2]}일`;
      });
    document.getElementById("selectDay").textContent = array.join(` `);
  }

  yymmddSelector() {
    const spans = document.querySelectorAll(".date:not(.space)");
    if (this.set.length != 0) {
      this.set.forEach((selectYYmmdd) => {
        spans.forEach((span) => {
          if (selectYYmmdd == span.yymmdd) {
            span.isClick = true;
            span.classList.add("click");
          }
        });
      });
    }
  }
  dateCheck() {
    const spans = document.querySelectorAll(".date:not(.space)");
    spans.forEach((span) => {
      if (this.getToday() == span.yymmdd) {
        span.classList.add("today");
      }
    });
  }

  getToday() {
    const year = this.today.getFullYear();
    const month = `/0${1 + this.today.getMonth()}`;
    const day = `/${this.today.getDate()}`;
    return `${year}${month}${day}`;
  }
}

window.onload = () => {
  const calendar = new App();
  document
    .getElementById("prev")
    .addEventListener("click", calendar.prevMonth.bind(calendar));
  document
    .getElementById("next")
    .addEventListener("click", calendar.nextMonth.bind(calendar));
};
