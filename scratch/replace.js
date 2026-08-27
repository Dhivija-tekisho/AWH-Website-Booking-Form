const fs = require('fs');
let data = fs.readFileSync('src/App.tsx', 'utf8');
data = data.replace(/<BookingDetailsCard\s*key={i}\s*title={`Option \${opt\.num\.replace\('\\.', ''\)}`}\s*isSuccess={true}\s*when={when}\s*doctor={doctor}\s*packageName={packageName}\s*referenceId={patient}\s*onClick={\(\) => handleSend\(opt\.num, false, opt\.val\)}\s*\/>/g, 
`<SelectionOptionCard 
  key={i}
  title={\`Option \${opt.num.replace('.', '')}\`}
  when={when}
  onClick={() => handleSend(opt.num, false, opt.val)}
/>`);
fs.writeFileSync('src/App.tsx', data);
