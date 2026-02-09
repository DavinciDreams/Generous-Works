import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineCopyButton,
  TimelineFullscreenButton,
  TimelineHeader,
  TimelineTitle,
  type TimelineData,
} from "@/components/ai-elements/timeline-client";

// Rich timeline data based on the History of the Internet
const testData: TimelineData = {
  title: {
    text: {
      headline: "History of the Internet",
      text: "<p>A timeline of key events in the development of the modern Internet</p>",
    },
  },
  events: [
    {
      unique_id: "arpanet-1969",
      start_date: { year: 1969, month: 10, day: 29 },
      text: {
        headline: "First ARPANET Message",
        text: "<p>The first message sent over ARPANET, the precursor to the Internet, was transmitted from UCLA to Stanford Research Institute. The intended message was 'LOGIN' but the system crashed after just the first two letters 'LO'.</p>",
      },
      media: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Arpanet_logical_map%2C_march_1977.png/800px-Arpanet_logical_map%2C_march_1977.png",
        caption: "ARPANET logical map, March 1977",
        credit: "Wikimedia Commons",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Arpanet_logical_map%2C_march_1977.png/200px-Arpanet_logical_map%2C_march_1977.png",
      },
    },
    {
      unique_id: "email-1971",
      start_date: { year: 1971, month: 1, day: 1 },
      text: {
        headline: "First Email Sent",
        text: "<p>Ray Tomlinson sent the first network email, introducing the '@' symbol to separate user names from computer names. This became the standard format still used today.</p>",
      },
    },
    {
      unique_id: "tcpip-1983",
      start_date: { year: 1983, month: 1, day: 1 },
      text: {
        headline: "TCP/IP Becomes Standard",
        text: "<p>ARPANET adopted TCP/IP as its standard networking protocol, marking the true birth of the Internet as we know it. This date is often considered the official birthday of the Internet.</p>",
      },
    },
    {
      unique_id: "www-proposal-1989",
      start_date: { year: 1989, month: 3, day: 12 },
      text: {
        headline: "World Wide Web Proposed",
        text: "<p>Tim Berners-Lee submitted his proposal for an information management system at CERN, which would become the World Wide Web. His vision was to create a way to share information between researchers worldwide.</p>",
      },
      media: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/First_Web_Server.jpg/800px-First_Web_Server.jpg",
        caption: "The first web server, a NeXT Computer at CERN",
        credit: "Wikimedia Commons",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/First_Web_Server.jpg/200px-First_Web_Server.jpg",
      },
    },
    {
      unique_id: "first-website-1991",
      start_date: { year: 1991, month: 8, day: 6 },
      text: {
        headline: "First Website Goes Live",
        text: "<p>Tim Berners-Lee published the first website at CERN, dedicated to information about the World Wide Web project itself. The site explained how to create web pages and set up a web server.</p>",
      },
    },
    {
      unique_id: "www-public-1993",
      start_date: { year: 1993, month: 4, day: 30 },
      text: {
        headline: "Web Made Publicly Available",
        text: "<p>CERN announced that the World Wide Web would be free to use for everyone, with no fees. This decision was crucial for the explosive growth of the web.</p>",
      },
    },
    {
      unique_id: "google-1998",
      start_date: { year: 1998, month: 9, day: 4 },
      text: {
        headline: "Google Founded",
        text: "<p>Larry Page and Sergey Brin founded Google Inc., which would become the world's most popular search engine and fundamentally change how people find information online.</p>",
      },
      media: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png",
        caption: "Google logo",
        credit: "Wikimedia Commons",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png",
      },
    },
    {
      unique_id: "facebook-2004",
      start_date: { year: 2004, month: 2, day: 4 },
      text: {
        headline: "Facebook Launched",
        text: "<p>Mark Zuckerberg launched Facebook from his Harvard dorm room, initially as a social network for college students. It would grow to become the world's largest social media platform.</p>",
      },
    },
    {
      unique_id: "youtube-2005",
      start_date: { year: 2005, month: 2, day: 14 },
      text: {
        headline: "YouTube Founded",
        text: "<p>YouTube was created by three former PayPal employees. The first video, 'Me at the zoo', was uploaded on April 23, 2005. Google acquired YouTube in 2006 for $1.65 billion.</p>",
      },
    },
    {
      unique_id: "iphone-2007",
      start_date: { year: 2007, month: 6, day: 29 },
      text: {
        headline: "iPhone Released",
        text: "<p>Apple released the first iPhone, revolutionizing mobile internet access and ushering in the era of smartphones. This fundamentally changed how people access and use the Internet.</p>",
      },
      media: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/400px-IPhone_1st_Gen.svg.png",
        caption: "First generation iPhone",
        credit: "Wikimedia Commons",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/200px-IPhone_1st_Gen.svg.png",
      },
    },
    {
      unique_id: "internet-users-2016",
      start_date: { year: 2016, month: 1, day: 1 },
      text: {
        headline: "Over 3.5 Billion Internet Users",
        text: "<p>The number of Internet users worldwide surpassed 3.5 billion people, representing nearly half of the global population. Mobile devices accounted for the majority of Internet access.</p>",
      },
    },
    {
      unique_id: "chatgpt-2022",
      start_date: { year: 2022, month: 11, day: 30 },
      text: {
        headline: "ChatGPT Released",
        text: "<p>OpenAI released ChatGPT, marking a significant milestone in artificial intelligence and natural language processing. It reached 100 million users in just two months, the fastest-growing consumer application in history.</p>",
      },
    },
  ],
};

export default function TimelineTestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Timeline Test</h1>
        <p className="text-muted-foreground mt-2">
          Interactive timeline using TimelineJS3
        </p>
      </div>

      <Timeline data={testData}>
        <TimelineHeader>
          <TimelineTitle>History of the Internet</TimelineTitle>
          <TimelineActions>
            <TimelineCopyButton />
            <TimelineFullscreenButton />
          </TimelineActions>
        </TimelineHeader>
        <TimelineContent />
      </Timeline>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Timeline Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Interactive timeline with 12 major events</li>
          <li>Images from Wikimedia Commons</li>
          <li>Click on events to see details</li>
          <li>Drag to navigate through time</li>
          <li>Zoom with mouse wheel</li>
        </ul>
      </div>
    </div>
  );
}
