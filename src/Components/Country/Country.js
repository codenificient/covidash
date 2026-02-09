import React from "react";
import "./country.css";
// Analytics will be accessed via window.analytics

const Country = ({ stats }) => {
  const flagged = new Map();
  flagged.set("Zimbabwe", "zw");
  flagged.set("Zambia", "zm");
  flagged.set("South Africa", "za");
  flagged.set("Mayotte", "yt");
  flagged.set("Yemen", "YE");
  flagged.set("Samoa", "ws");
  flagged.set("Wallist and Futura", "wf");
  flagged.set("Vanuatu", "VU");
  flagged.set("Vietnam", "VN");
  flagged.set("Virgin Islands", "VI");
  flagged.set("Venezuela", "VE");
  flagged.set("Saint Vincent and the Grenadines", "VC");
  flagged.set("Italy", "IT");
  flagged.set("Bangladesh", "BD");
  flagged.set("Jersey", "JE");
  flagged.set("Iceland", "IS");
  flagged.set("Israel", "IL");
  flagged.set("Burundi", "BI");
  flagged.set("Cabo Verde", "CV");
  flagged.set("Congo (Kinshasa)", "CD");
  flagged.set("Congo (Brazzaville)", "CG");
  flagged.set("Comoros", "KM");
  flagged.set("Colombia", "CO");
  flagged.set("Canada", "ca");
  flagged.set("Angola", "AO");
  flagged.set("Algeria", "dz");
  flagged.set("Antigua and Barbuda", "AG");
  flagged.set("Argentina", "AR");
  flagged.set("Armenia", "AM");
  flagged.set("Australia", "AU");
  flagged.set("Austria", "at");
  flagged.set("Bahrain", "BH");
  flagged.set("Bahamas", "BS");
  flagged.set("Benin", "BJ");
  flagged.set("Belgium", "BE");
  flagged.set("Central African Republic", "CF");
  flagged.set("Grenada", "GD");
  flagged.set("Greece", "GR");
  flagged.set("Ireland", "IE");
  flagged.set("Iraq", "IQ");
  flagged.set("Iran", "IR");
  flagged.set("Jamaica", "JM");
  flagged.set("Mali", "ML");
  flagged.set("Malta", "MT");
  flagged.set("Kazakhstan", "KZ");
  flagged.set("Denmark", "dk");
  flagged.set("Guinea", "GN");
  flagged.set("Guinea-Bissau", "GW");
  flagged.set("Equatorial Guinea", "GQ");
  flagged.set("Poland", "PL");
  flagged.set("Suriname", "SR");
  flagged.set("Switzerland", "CH");
  flagged.set("Sierra Leone", "SL");
  flagged.set("Slovenia", "SI");
  flagged.set("Slovakia", "SK");
  flagged.set("Uruguay", "UY");
  flagged.set("Ukraine", "UA");
  flagged.set("Turkey", "TR");
  flagged.set("Tunisia", "TN");
  flagged.set("Sudan", "SD");
  flagged.set("South Sudan", "SS");
  flagged.set("Bosnia and Herzegovina", "BA");
  flagged.set("Micronesia", "MS");
  flagged.set("Isle of Man", "IM");
  flagged.set("Korea, South", "KR");
  flagged.set("Solomon Islands", "SB");
  flagged.set("Sweden", "SE");
  flagged.set("Serbia", "RS");
  flagged.set("China", "cn");
  flagged.set("Chile", "cl");
  flagged.set("Maldives", "mv");
  flagged.set("Madagascar", "mg");
  flagged.set("Moldova", "md");
  flagged.set("Mongolia", "mn");
  flagged.set("Monaco", "mc");
  flagged.set("Montenegro", "me");
  flagged.set("Pakistan", "pk");
  flagged.set("Panama", "pa");
  flagged.set("Paraguay", "py");
  flagged.set("Portugal", "pt");
  flagged.set("Mozambique", "mz");
  flagged.set("Brunei", "BN");
  flagged.set("Belarus", "BY");
  flagged.set("Belize", "BZ");
  flagged.set("Barbados", "BB");
  flagged.set("Andorra", "ad");
  flagged.set("Summer Olympics 2020", "CX");
  flagged.set("Eswatini", "SZ");
  flagged.set("Diamond Princess", "MF");
  flagged.set("Libya", "LY");
  flagged.set("Liberia", "LR");
  flagged.set("MS Zaandam", "mo");
  flagged.set("West Bank and Gaza", "cc");

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  };

  let query = flagged.get(stats.name) || stats.countryCode;
  query = query.toLowerCase();

  // Track country view when component renders
  React.useEffect(() => {
    if (window.analytics) {
      window.analytics
        .track("country_viewed", {
          app_name: "CoviDash",
          country_name: stats.name,
          country_code: stats.countryCode,
          confirmed_cases: stats.total,
          deaths: stats.dead,
          recovered: stats.healthy,
          active_cases: stats.actives,
        })
        .catch((error) => {
          console.warn("Analytics track failed:", error);
        });
    }
  }, [
    stats.name,
    stats.countryCode,
    stats.total,
    stats.dead,
    stats.healthy,
    stats.actives,
  ]);

  return (
    <div className="country">
      <img
        src={`https://flagcdn.com/h120/${query}.png`}
        alt={`Flag of ${stats.name}`}
      />
      <h2>{stats.name}</h2>
      <div className="cases sb">
        <p>
          {`Confirmed : `}
          <span className="qty">{formatNumber(stats.total)}</span>
        </p>
        {/* <p>
          {`Active : `}
          <span className="qty">{stats.actives}</span>
        </p> */}
        <p>
          {`Deaths : `}
          <span className="qty">{formatNumber(stats.dead)}</span>
        </p>
        {/* <p>
          {`Recovered : `}
          <span className="qty">{stats.healthy}</span>
        </p> */}
      </div>
    </div>
  );
};

export default Country;
