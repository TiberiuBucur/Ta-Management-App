import { Socket } from "dgram";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Slot from "./Slot";
import "./SlotBox.css";

const sock = io("ws://localhost:5555");
sock.on("connect", () => {
  console.log("CONNECTED");
});
(document as any).socca = sock;

const SlotBox = ({ slot, setSlots }: { slot: Slot; setSlots: any }) => {
  const [isPopup, setIsPopup] = useState(false);
  const [free, setFree] = useState<number[]>([]);
  // const sock = useRef<any>(
  //   slot.status === "ASSIGNED" ? io.connect("http://localhost:5555") : undefined
  // );

  useEffect(() => {
    if (slot.status === "ASSIGNED") {
      sock.on(`free_channel_for_${slot.id}`, chNo => {
        setFree(prev => [...prev, chNo]);
      });
      // sock.current.on(`free_channel_for_${slot.id}`, (data: any) => {
      //   console.log(data);
      // });
    }
  }, []);

  const getDateText = (slot: Slot): string =>
    `${slot.day}, ${slot.date.day}/${slot.date.month}`;
  const getTimeText = (slot: Slot): string => `${slot.startH} - ${slot.endH}`;
  const getAssignmentText = ({ assignment }: Slot): JSX.Element => {
    switch (assignment) {
      case "none":
        return <span>You are unavailable for this slot</span>;
      case "backup":
        return (
          <span>
            You are a <span className="bolden">BACKUP</span> for this slot
          </span>
        );
      default:
        return (
          <span>
            You have been assigned{" "}
            <span className="bolden">Channel {assignment}</span>
          </span>
        );
    }
  };
  const getExtraText = ({ assignment, status }: Slot): JSX.Element => {
    switch ((status as string).toLowerCase()) {
      case "missed":
        return <span>You have missed this slot</span>;
      case "ready_to_claim":
        return (
          <span>
            <a
              href="https://tsc.doc.ic.ac.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>{" "}
            to claim for this work hour
          </span>
        );
      case "claimed":
        return <span>This work hour is claimed</span>;
      case "unavailable":
        return <span>There is no available channel</span>;
      case "assigned":
        const endStr: string =
          assignment === "backup"
            ? " to view any free channels"
            : " if you cannot attend this slot";
        const linkClass =
          assignment === "backup" ? "for-backup" : "for-channel";
        const handler = (event: any) => {
          if (event.target.className.includes("for-channel")) {
            setIsPopup(true);
            return;
          }

          if (event.target.className.includes("for-backup")) {
            setIsPopup(true);
            return;
          }
        };
        return (
          <span>
            <button
              onClick={handler}
              className={"click-here-bttn " + linkClass}
            >
              Click here
            </button>
            {endStr}
          </span>
        );
      default:
        alert("Something went wrong");
        return <span></span>;
    }
  };

  return (
    <div className={`slot-box ${slot.status}`}>
      {isPopup && (
        <div className="popup">
          {slot.assignment === "backup" ? (
            <div>
              {free.length === 0
                ? "There are no free channels at the moment"
                : free.map(no => (
                    <button
                      key={no}
                      className="free-ch-bttn"
                      onClick={() => {
                        setSlots((prev: Slot[]) => {
                          const copy = [...prev];
                          const index = copy.findIndex(el => el.id === slot.id);

                          copy[index] = {
                            ...slot,
                            assignment: no,
                          };
                          return copy;
                        });
                        setIsPopup(false);
                      }}
                    >
                      Channel {no}
                    </button>
                  ))}
              <button className="close-bttn" onClick={() => setIsPopup(false)}>
                Close
              </button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: "center" }}>
                Are you sure you want to yield this slot?
              </div>
              <div className="confirm-bttns">
                <button
                  className="confirm-miss-slot-bttn"
                  onClick={() => {
                    // TODO: Change to missed / backup
                    // TODO: submit to backend

                    console.log(sock);
                    sock.emit("free_channel", {
                      slotid: slot.id,
                      channelNo: slot.assignment,
                    });

                    setSlots((prev: Slot[]) => {
                      const copy = [...prev];
                      const index = copy.findIndex(el => el.id === slot.id);

                      copy[index] = {
                        ...slot,
                        assignment: "backup",
                      };
                      return copy;
                    });
                    setIsPopup(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="cancel-miss-slot-bttn"
                  onClick={() => setIsPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="date-time">
        <span className="date">{getDateText(slot)}</span>
        <span className="time">{getTimeText(slot)}</span>
      </div>
      <br />
      <div className="assignment">{getAssignmentText(slot)}</div>
      <br />
      <div className="extra">{getExtraText(slot)}</div>
    </div>
  );
};

export default SlotBox;
