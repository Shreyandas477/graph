const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const Grav_const = 6.67430e-11; 
const EARTH_m = 5.972e24; 
const EARTH_r = 6371000;

const ctx = document.getElementById('graph').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'thrust', data: [], borderColor: 'red', fill: false },
        { label: 'drag force', data: [], borderColor: 'blue', fill: false },
        { label: 'Altitude', data: [], borderColor: 'green', fill: false },
        { label: 'fuel mass', data: [], borderColor: 'purple', fill: false },
        { label: 'acceleration', data: [], borderColor: 'orange', fill: false },
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Time (s)' } },
        y: { title: { display: true, text: 'Values' } }
      }
    }
  });

  let time = 0;
  let interval;
  startBtn.addEventListener('click', () => {
    clearInterval(interval);
    const P_atm = parseFloat(document.getElementById("info_input1").value);
    const g = parseFloat(document.getElementById("info_input2").value);
    const rocket_mass = parseFloat(document.getElementById("info_input3").value);
    let fuel_mass = parseFloat(document.getElementById("info_input4").value);
    const rocket_fuel_amount = parseFloat(document.getElementById("info_input5").value);
    const P = parseFloat(document.getElementById("info_input6").value);
    let velocity = parseFloat(document.getElementById("info_input7").value);
    let altitude = parseFloat(document.getElementById("info_input8").value);
    const rocket_angle = parseFloat(document.getElementById("info_input9").value);
    const r_m_per_s = parseFloat(document.getElementById("info_input10").value);
    const exhaust_v = parseFloat(document.getElementById("info_input11").value);
    const wind_speed = parseFloat(document.getElementById("info_input12").value);
    const rate_of_fuel_burning = parseFloat(document.getElementById("info_input13").value);

    let full_mass = rocket_mass + fuel_mass;

    interval = setInterval(() => {
      if (fuel_mass <= 0) {
        clearInterval(interval);
        return;
      }

      const thrust = (P - P_atm) * (rocket_fuel_amount / 1000) * 9.81;
      const drag_force = 0.5 * P_atm * (velocity ** 2) * (rocket_fuel_amount / 1000);
      const weight = rocket_mass * (g / (1 + altitude / EARTH_r) ** 2);
      const a = (thrust - weight - drag_force) / (full_mass);

      velocity += a * 0.1;
      altitude += velocity * 0.1;
      fuel_mass -= rate_of_fuel_burning * 0.1;

      chart.data.labels.push(time.toFixed(1));
      chart.data.datasets[0].data.push(thrust);
      chart.data.datasets[1].data.push(drag_force);
      chart.data.datasets[2].data.push(altitude);
      chart.data.datasets[3].data.push(fuel_mass);
      chart.data.datasets[4].data.push(a);

      chart.update();
      time += 0.1;
    }, 100);
  });

  pauseBtn.addEventListener('click', () => {
    clearInterval(interval);
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    time = 0;
    chart.data.labels = [];
    chart.data.datasets.forEach(ds => ds.data = []);
    chart.update();
  });