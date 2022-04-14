import React, { useEffect, useState, useMemo } from "react";
import { fetchEvents } from "utils/storyblok";

import { UpcomingEvent, EventSearchBar, PastEvent } from "components/Event";
import { convertUTCtoLocalTime } from "utils/date";

const Event = () => {
  const [eventType, setEventType] = useState("upcoming");

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEvents();

      data.sort((a, b) => {
        const aEventTime = new Date(a.content.EventTime).getTime();
        const bEventTime = new Date(b.content.EventTime).getTime();

        const currentTime = new Date().getTime();

        return aEventTime > bEventTime ? 1 : -1;
      });
      setEvents(data);
    };

    getData();
  }, []);

  const filteredEvents = useMemo(() => {
    const tempEvents = events.filter((event) => {
      const currentTime = new Date().getTime();
      const eventTime = convertUTCtoLocalTime(
        new Date(event.content.EventTime).getTime()
      );

      if (eventType === "upcoming") {
        if (eventTime >= currentTime) {
          return true;
        }
      } else if (eventType === "past") {
        if (eventTime < currentTime) {
          return true;
        }
      }

      return false;
    });

    tempEvents.sort((a, b) => {
      const aEventTime = new Date(a.content.EventTime).getTime();
      const bEventTime = new Date(b.content.EventTime).getTime();

      if (eventType === "upcoming") {
        return aEventTime > bEventTime ? 1 : -1;
      }

      return aEventTime > bEventTime ? -1 : 1;
    });

    return tempEvents;
  }, [events, eventType]);

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
          {filteredEvents.map((event) =>
            eventType === "upcoming" ? (
              <UpcomingEvent data={event} key={event.uuid} />
            ) : (
              <PastEvent data={event} key={event.uuid} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
