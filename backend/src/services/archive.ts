import { load } from "cheerio";
import { format, parseISO } from "date-fns";

// Define message interface to match what MessagesLogger expects
interface MessageEvent {
  roomId: string;
  msg: string;
  sender: string | undefined;
  messageId: string | undefined;
  date: Date | null;
}

/**
 * Fetches and parses messages from the Matrix HTML archive within a date range
 * @param archiveUrl URL of the Matrix HTML archive
 * @param roomId Matrix room ID
 * @param fromDateString Start date in "yyyy-MM-dd" format
 * @param toDateString End date in "yyyy-MM-dd" format
 */
export async function fetchArchivedMessages(
  archiveUrl: string,
  roomId: string,
  fromDateString: string,
  toDateString: string
): Promise<MessageEvent[]> {
  try {
    console.log(`Fetching messages from ${fromDateString} to ${toDateString}`);

    // Fetch the HTML content from the archive
    const response = await fetch(archiveUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch archive data: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Parse message elements
    const messages: MessageEvent[] = [];

    // Select only messages with class "msg" but not those with class "msg reply"
    $("div.msg:not(.reply)").each((_index: number, element) => {
      const timestampElement = $(element).find("a.ts");
      const dateStr = timestampElement.text().trim();

      // Skip if we can't find a date
      if (!dateStr) return;

      // Parse the date from the timestamp text
      // Format is "YYYY-MM-DD HH:MM"
      const date = new Date(dateStr);
      const messageDateString = format(date, "yyyy-MM-dd");

      // Check if the message date is within our target range
      if (
        messageDateString >= fromDateString &&
        messageDateString <= toDateString
      ) {
        const sender = $(element).find("span.u").text().trim();

        // Extract message content - it's the text content after the sender part
        let elementText = $(element).text().trim();
        let msgStartIndex = elementText.indexOf(sender) + sender.length;
        // Skip the colon and space after the username
        if (elementText.substring(msgStartIndex, msgStartIndex + 2) === ": ") {
          msgStartIndex += 2;
        }
        let msg = elementText.substring(msgStartIndex).trim();

        // Remove "(edited)" from the end of messages if present
        msg = msg.replace(/\s*\(edited\)\s*$/, "");

        // Extract an event ID from the timestamp link if available
        const messageLink = timestampElement.attr("href") || "";
        // Matrix links are like https://matrix.to/#/!ddsEwXlCWnreEGuqXZ:polkadot.io/$As-SgAcpMlrovz9DmsOui1pMUvt8HVeSnHd-_XZqaA8
        // We want the part after the $ which is the event ID
        const dollarIndex = messageLink.lastIndexOf("$");
        const eventId =
          dollarIndex !== -1
            ? messageLink.substring(dollarIndex)
            : `${roomId}-${date.getTime()}-${Math.random()
                .toString(36)
                .substring(2, 10)}`;

        messages.push({
          roomId,
          msg,
          sender,
          messageId: eventId,
          date,
        });
      }
    });

    console.log(
      `Found ${messages.length} messages between ${fromDateString} and ${toDateString} in room ${roomId}`
    );
    return messages;
  } catch (error) {
    console.error(`Error fetching messages from archive ${archiveUrl}:`, error);
    return [];
  }
}
