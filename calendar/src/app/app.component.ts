import {
  Component,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfWeek,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

import { AlertifyService } from './services/alertify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  title = 'TO DO LIST';

  colors: any = {
    red: {
      primary: '#ad2121',
    },
    blue: {
      primary: '#1e90ff',
    },
    yellow: {
      primary: '#e3bc08',
    },
  };

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 0),
      end: addDays(endOfDay(startOfDay(new Date())), 4),
      title: 'Working',
      color: this.colors.red,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 20),
      end: addHours(endOfDay(new Date()), -3),
      title: 'Workout',
      color: this.colors.yellow,
      allDay: true
    },
    {
      start: addHours(startOfDay(endOfWeek(new Date())), 9),
      end: addHours(startOfDay(endOfWeek(new Date())), 11),
      title: 'Training Dog',
      color: this.colors.yellow,
      allDay: true
    },
  ];

  activeDayIsOpen = true;

  constructor(
    private modal: NgbModal,
    private alertifyService: AlertifyService) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.alertifyService.success(`Selected Event's Time Changed`);
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New Event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: this.colors.red,
        allDay: true
      }
    ];

    this.alertifyService.success('New Event Added');
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.alertifyService.success('Selected Event Deleted');
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
