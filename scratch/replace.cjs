const fs = require('fs');
let data = fs.readFileSync('src/App.tsx', 'utf8');
data = data.replace(/<BookingDetailsCard[\s\S]*?key={i}[\s\S]*?title={`Option \${opt\.num\.replace\('\.', ''\)}`}[\s\S]*?isSuccess={true}[\s\S]*?when={when}[\s\S]*?doctor={doctor}[\s\S]*?packageName={packageName}[\s\S]*?referenceId={patient}[\s\S]*?onClick={\(\) => handleSend\(opt\.num, false, opt\.val\)}[\s\S]*?\/>/, 
`<SelectionOptionCard 
  key={i}
  title={\`Option \${opt.num.replace('.', '')}\`}
  when={when}
  onClick={() => handleSend(opt.num, false, opt.val)}
/>`);
fs.writeFileSync('src/App.tsx', data);
