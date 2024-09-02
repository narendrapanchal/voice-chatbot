import '../styles/GridBox.css'; // Import the CSS file

// Define the topics with corresponding icons
const topics = [
  { name: 'Laughter', icon: '🤣',text:"Give information about laughter in everyday." },
  { name: 'Anger', icon: '😡',text:"Give information about anger issue." },
  { name: 'Milk', icon: '🍶', text:"Give information about taking milk in the night." },
  { name: 'Search Engines', icon: '🔍', text:"Give information about Search Engines." },
];

 const GridBox = ({fetchResponse,setTranscript}) => {
  return (
    <div className="grid-container">
      {topics.map((topic, index) => (
        <div key={index} className="grid-item" onClick={()=>{
            fetchResponse(topic.text);
            setTranscript(topic.text)
        }}>
          <span>{topic.icon} {topic.name}</span>
        </div>
      ))}
    </div>
  );
};
export default GridBox