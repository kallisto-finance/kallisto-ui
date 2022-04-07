import React, { useEffect, useState } from "react";
import { fetchEvents } from "utils/storyblok";

import { UpcomingEvent, EventSearchBar, PastEvent } from "components/Event";
import {
  convertDateStringWithWeekDay,
  convertTimeString,
  GetRemainDays,
  convertUTCtoLocalTime
} from "utils/date";

const Event = () => {
  const [eventType, setEventType] = useState("upcoming");

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="event-page-container">
        <div className="event-searchbar-wrapper">
          <EventSearchBar
            onSelect={(type) => setEventType(type)}
            eventType={eventType}
          />
        </div>
        <div className="event-list-wrapper">
          {events.map((event) => {
            const currentTime = (new Date()).getTime();
            const eventTime = convertUTCtoLocalTime((new Date(event.content.EventTime)).getTime());
            if (eventType === "upcoming") {
              if (eventTime < currentTime) {
                return null;
              }
              return <UpcomingEvent data={event} key={event.uuid} />;
            } else if (eventType === "past") {
              if (eventTime > currentTime) {
                return null;
              }
              return <PastEvent data={event} key={event.uuid} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Event;
