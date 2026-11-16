"use strict";

/*
 * =============================================================
 * PHYSIKALISCHE KONSTANTEN
 * =============================================================
 */

const GRAVITY = 9.80665;
const WATER_DENSITY = 1025;
const STEEL_DENSITY = 7850;
const AIR_DENSITY = 1.225;
const KNOTS_TO_METERS_PER_SECOND = 0.514444;

const CHAIN_MASSES = {
  "6": 0.80,
  "8": 1.40,
  "10": 2.30
};

/*
 * =============================================================
 * STANDARDISIERTES TAUWERK-PRÜFVERFAHREN
 * =============================================================
 */

const STANDARD_ROPE_TEST = {
  condition: "neu",
  environment: "trocken",
  preloadCycles: 3,
  preloadFraction: 0.5,
  zeroedAfterPreloading: true,
  averagedMeasurements: 3
};

/*
 * Kraftwerte der Kurven sind intern in Newton gespeichert.
 * Die ursprünglichen Messdateien verwendeten daN.
 *
 * Die Kurven wurden für die Anwendung auf Stützpunkte reduziert.
 * Zwischen den Punkten wird linear interpoliert.
 */

const ROPE_LIBRARY = {
  "robline-8-plait-14": {
    id: "robline-8-plait-14",
    manufacturer: "Robline",
    product: "8-Plait",
    material: "Polyamid",
    construction: "8-fach geflochten",
    diameterMm: 14,
    dryMassKgPerMeter: 0.10961,
    meanBreakingLoadN: 41690,
    maximumMeasuredCurveForceN: 40560,
    measurement: STANDARD_ROPE_TEST,

    strainCurve: [
      [0, 0],
      [1000, 2.6106],
      [2000, 6.1781],
      [3000, 9.1713],
      [4000, 11.4170],
      [5000, 13.2325],
      [6000, 14.6652],
      [7000, 15.8626],
      [8000, 16.9397],
      [9000, 17.8218],
      [10000, 18.6649],
      [11000, 19.4142],
      [12000, 20.1246],
      [13000, 20.7509],
      [14000, 21.3417],
      [15000, 21.9297],
      [16000, 22.4058],
      [17000, 22.9194],
      [18000, 23.4152],
      [19000, 23.8659],
      [20000, 24.3452],
      [21000, 24.8013],
      [22000, 25.2511],
      [23000, 25.6688],
      [24000, 26.1270],
      [25000, 26.6159],
      [26000, 27.1115],
      [27000, 27.6544],
      [28000, 28.1874],
      [29000, 28.7537],
      [30000, 29.3351],
      [31000, 29.9166],
      [32000, 30.5196],
      [33000, 31.2395],
      [34000, 31.8570],
      [35000, 32.4017],
      [36000, 33.0682],
      [37000, 33.8220],
      [38000, 34.4294],
      [39000, 35.3530],
      [40000, 36.3544],
      [40560, 36.7936]
    ]
  },

  "liros-handy-elastic-14": {
    id: "liros-handy-elastic-14",
    manufacturer: "Liros",
    product: "Handy Elastic",
    material: "Polyamid",
    construction: "elastisches Festmacher-Tauwerk",
    diameterMm: 14,
    dryMassKgPerMeter: 0.10327,
    meanBreakingLoadN: 43630,
    maximumMeasuredCurveForceN: 39740,
    measurement: STANDARD_ROPE_TEST,

    strainCurve: [
      [0, 0],
      [1000, 1.0371],
      [2000, 2.6444],
      [3000, 4.2886],
      [4000, 5.6753],
      [5000, 6.7892],
      [6000, 7.7240],
      [7000, 8.4879],
      [8000, 9.1790],
      [9000, 9.8096],
      [10000, 10.3579],
      [11000, 10.8804],
      [12000, 11.3609],
      [13000, 11.7988],
      [14000, 12.2260],
      [15000, 12.6307],
      [16000, 13.0143],
      [17000, 13.3869],
      [18000, 13.7416],
      [19000, 14.1134],
      [20000, 14.4775],
      [21000, 14.8231],
      [22000, 15.2117],
      [23000, 15.6026],
      [24000, 15.9748],
      [25000, 16.3923],
      [26000, 16.8236],
      [27000, 17.3762],
      [28000, 17.7950],
      [29000, 18.2019],
      [30000, 18.6842],
      [31000, 19.0949],
      [32000, 19.5304],
      [33000, 20.0779],
      [34000, 20.6532],
      [35000, 21.0515],
      [36000, 21.5481],
      [37000, 22.0602],
      [38000, 22.5487],
      [39000, 23.2163],
      [39740, 24.0624]
    ]
  }
};

let gearType = "chain";
let calculationMode = "required";

/*
 * =============================================================
 * HILFSFUNKTIONEN
 * =============================================================
 */

function element(id) {
  return document.getElementById(id);
}

function readNumber(id) {
  const raw = String(element(id).value)
    .trim()
    .replace(",", ".");

  return Number(raw);
}

function setText(id, text) {
  element(id).textContent = text;
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) {
    return "–";
  }

  return value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatMeters(value) {
  return formatNumber(value, 2) + " m";
}

function formatKilonewtons(value) {
  return formatNumber(value / 1000, 2) + " kN";
}

function formatPercent(value) {
  return formatNumber(value, 2) + " %";
}

function showError(message) {
  const box = element("errorMessage");
  box.textContent = message;
  box.style.display = "block";
}

function hideError() {
  const box = element("errorMessage");
  box.textContent = "";
  box.style.display = "none";
}

function setStatus(id, type, text) {
  const box = element(id);
  box.className = "status " + type;
  box.textContent = text;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

/*
 * =============================================================
 * WINDLAST
 * =============================================================
 */

function calculateWindLoad(
  windSpeedKnots,
  effectiveWindArea
) {
  const speedMetersPerSecond =
    windSpeedKnots *
    KNOTS_TO_METERS_PER_SECOND;

  const dynamicPressure =
    0.5 *
    AIR_DENSITY *
    speedMetersPerSecond *
    speedMetersPerSecond;

  return {
    speedMetersPerSecond,
    dynamicPressure,
    effectiveWindArea,
    force: dynamicPressure * effectiveWindArea
  };
}

/*
 * =============================================================
 * LEINENKENNLINIE
 * =============================================================
 */

function interpolateRopeStrain(forceN, rope) {
  if (forceN < 0) {
    throw new Error(
      "Die berechnete Leinenkraft ist negativ."
    );
  }

  if (forceN > rope.maximumMeasuredCurveForceN) {
    throw new Error(
      "Die Leinenkraft von " +
      formatKilonewtons(forceN) +
      " liegt oberhalb des gemessenen Kennlinienbereichs von " +
      formatKilonewtons(
        rope.maximumMeasuredCurveForceN
      ) +
      ". Eine Extrapolation wird nicht durchgeführt."
    );
  }

  const curve = rope.strainCurve;

  if (forceN <= curve[0][0]) {
    return curve[0][1];
  }

  for (let index = 1; index < curve.length; index++) {
    const previous = curve[index - 1];
    const current = curve[index];

    const force1 = previous[0];
    const strain1 = previous[1];
    const force2 = current[0];
    const strain2 = current[1];

    if (forceN <= force2) {
      const fraction =
        (forceN - force1) /
        (force2 - force1);

      return (
        strain1 +
        fraction *
        (strain2 - strain1)
      );
    }
  }

  return curve[curve.length - 1][1];
}

function calculateLoadedRopeLength(
  unloadedLength,
  tension,
  rope
) {
  const strainPercent =
    interpolateRopeStrain(tension, rope);

  const loadedLength =
    unloadedLength *
    (1 + strainPercent / 100);

  return {
    strainPercent,
    loadedLength,
    extension:
      loadedLength - unloadedLength
  };
}

/*
 * =============================================================
 * KETTENGEOMETRIE
 * =============================================================
 */

/*
 * Kettengeometrie anhand der unteren vertikalen Kraft V0.
 *
 * V0 = 0:
 * horizontaler Verlauf am unteren Kettenende.
 *
 * V0 > 0:
 * gesamte Kette ist vom Boden abgehoben.
 */
function calculateChainGeometry(
  horizontalForce,
  weightPerMeter,
  chainLength,
  verticalForceAtLowerEnd = 0
) {
  const lowerTension = Math.hypot(
    horizontalForce,
    verticalForceAtLowerEnd
  );

  const verticalForceAtUpperEnd =
    verticalForceAtLowerEnd +
    weightPerMeter * chainLength;

  const upperTension = Math.hypot(
    horizontalForce,
    verticalForceAtUpperEnd
  );

  const verticalRise =
    (upperTension - lowerTension) /
    weightPerMeter;

  const horizontalSpan =
    horizontalForce /
    weightPerMeter *
    (
      Math.asinh(
        verticalForceAtUpperEnd /
        horizontalForce
      ) -
      Math.asinh(
        verticalForceAtLowerEnd /
        horizontalForce
      )
    );

  return {
    verticalForceAtLowerEnd,
    verticalForceAtUpperEnd,
    lowerTension,
    upperTension,
    verticalRise,
    horizontalSpan
  };
}

/*
 * =============================================================
 * EINGABE UND BEDIENUNG
 * =============================================================
 */

function readInput() {
  return {
    waterDepth: readNumber("waterDepth"),
    additionalWater: readNumber("additionalWater"),
    bowHeight: readNumber("bowHeight"),

    chainMass: readNumber("chainMass"),
    chainSeabedReserve:
      readNumber("chainSeabedReserve"),
    availableChainLength:
      readNumber("availableChainLength"),

    chainLeadLength:
      readNumber("chainLeadLength"),
    combinationSeabedReserve:
      readNumber("combinationSeabedReserve"),
    availableRopeLength:
      readNumber("availableRopeLength"),
    ropePreset: element("ropePreset").value,

    loadSource: element("loadSource").value,
    horizontalLoadKN:
      readNumber("horizontalLoad"),
    windSpeedKnots:
      readNumber("windSpeed"),
    effectiveWindArea:
      readNumber("effectiveWindArea"),
    loadFactor:
      readNumber("loadFactor"),

    chainWorkingLoadKN:
      readNumber("chainWorkingLoad")
  };
}

function validateInput(input) {
  const commonValues = [
    input.waterDepth,
    input.additionalWater,
    input.bowHeight,
    input.chainMass,
    input.loadFactor,
    input.chainWorkingLoadKN
  ];

  if (
    commonValues.some(
      value => !Number.isFinite(value)
    )
  ) {
    throw new Error(
      "Bitte in allen sichtbaren Feldern gültige Zahlen eingeben."
    );
  }

  if (input.waterDepth <= 0) {
    throw new Error(
      "Die Wassertiefe muss größer als 0 sein."
    );
  }

  if (
    input.additionalWater < 0 ||
    input.bowHeight < 0
  ) {
    throw new Error(
      "Wasserstand und Bugrollenhöhe dürfen nicht negativ sein."
    );
  }

  if (input.chainMass <= 0) {
    throw new Error(
      "Die Kettenmasse muss größer als 0 sein."
    );
  }

  if (input.loadFactor < 1) {
    throw new Error(
      "Der Lastfaktor muss mindestens 1 betragen."
    );
  }

  if (input.chainWorkingLoadKN < 0) {
    throw new Error(
      "Die Arbeitslast darf nicht negativ sein."
    );
  }

  if (input.loadSource === "direct") {
    if (
      !Number.isFinite(input.horizontalLoadKN) ||
      input.horizontalLoadKN <= 0
    ) {
      throw new Error(
        "Die horizontale Kraft muss größer als 0 sein."
      );
    }
  } else {
    if (
      !Number.isFinite(input.windSpeedKnots) ||
      input.windSpeedKnots <= 0
    ) {
      throw new Error(
        "Die Windgeschwindigkeit muss größer als 0 sein."
      );
    }

    if (
      !Number.isFinite(input.effectiveWindArea) ||
      input.effectiveWindArea <= 0
    ) {
      throw new Error(
        "Die effektive Windangriffsfläche muss größer als 0 sein."
      );
    }
  }

  if (gearType === "chain") {
    if (calculationMode === "required") {
      if (
        !Number.isFinite(input.chainSeabedReserve) ||
        input.chainSeabedReserve < 0
      ) {
        throw new Error(
          "Die Bodenreserve darf nicht negativ sein."
        );
      }
    } else if (
      !Number.isFinite(input.availableChainLength) ||
      input.availableChainLength <= 0
    ) {
      throw new Error(
        "Die vorhandene Kettenlänge muss größer als 0 sein."
      );
    }
  } else {
    if (
      !Number.isFinite(input.chainLeadLength) ||
      input.chainLeadLength <= 0
    ) {
      throw new Error(
        "Die Länge des Kettenvorlaufs muss größer als 0 sein."
      );
    }

    if (calculationMode === "required") {
      if (
        !Number.isFinite(
          input.combinationSeabedReserve
        ) ||
        input.combinationSeabedReserve < 0
      ) {
        throw new Error(
          "Die Kettenreserve darf nicht negativ sein."
        );
      }

      if (
        input.combinationSeabedReserve >=
        input.chainLeadLength
      ) {
        throw new Error(
          "Ein Teil des Kettenvorlaufs muss frei hängen. " +
          "Die Bodenreserve muss kleiner als die gesamte " +
          "Länge des Kettenvorlaufs sein."
        );
      }
    } else if (
      !Number.isFinite(input.availableRopeLength) ||
      input.availableRopeLength <= 0
    ) {
      throw new Error(
        "Die vorhandene Leinenlänge muss größer als 0 sein."
      );
    }
  }
}

function updateChainSelection() {
  const preset =
    element("chainPreset").value;

  const input =
    element("chainMass");

  if (preset === "custom") {
    input.readOnly = false;
  } else {
    input.value =
      CHAIN_MASSES[preset].toFixed(2);

    input.readOnly = true;
  }

  calculate();
}

function updateLoadSource() {
  const source =
    element("loadSource").value;

  element("directLoadFields")
    .classList.toggle(
      "hidden",
      source !== "direct"
    );

  element("windLoadFields")
    .classList.toggle(
      "hidden",
      source !== "wind"
    );

  calculate();
}

function updateRopeInformation() {
  const rope =
    ROPE_LIBRARY[
      element("ropePreset").value
    ];

  const preloadForce =
    rope.meanBreakingLoadN *
    rope.measurement.preloadFraction;

  element("ropeInformation").innerHTML = `
    <dl>
      <dt>Hersteller:</dt>
      <dd>${rope.manufacturer}</dd>

      <dt>Produkt:</dt>
      <dd>${rope.product}</dd>

      <dt>Material:</dt>
      <dd>${rope.material}</dd>

      <dt>Durchmesser:</dt>
      <dd>${formatNumber(rope.diameterMm, 0)} mm</dd>

      <dt>Gemessene Masse:</dt>
      <dd>
        ${formatNumber(
          rope.dryMassKgPerMeter * 1000,
          2
        )} g/m
      </dd>

      <dt>Mittlere Bruchlast:</dt>
      <dd>
        ${formatKilonewtons(
          rope.meanBreakingLoadN
        )}
      </dd>

      <dt>Kennlinie gemessen bis:</dt>
      <dd>
        ${formatKilonewtons(
          rope.maximumMeasuredCurveForceN
        )}
      </dd>

      <dt>Prüfzustand:</dt>
      <dd>
        neu, trocken, drei Messungen gemittelt
      </dd>

      <dt>Vorkonditionierung:</dt>
      <dd>
        3 × bis 50 % der Bruchlast
        (${formatKilonewtons(preloadForce)}),
        anschließend neu genullt
      </dd>
    </dl>
  `;

  calculate();
}

function setGearType(type) {
  gearType = type;

  element("gearChainButton")
    .classList.toggle(
      "active",
      type === "chain"
    );

  element("gearCombinationButton")
    .classList.toggle(
      "active",
      type === "combination"
    );

  element("combinationFields")
    .classList.toggle(
      "hidden",
      type !== "combination"
    );

  if (type === "chain") {
    setText(
      "gearDescription",
      "Die gesamte Verbindung zwischen Anker und Bugrolle " +
      "besteht aus Kette."
    );
  } else {
    setText(
      "gearDescription",
      "Ein fester Kettenvorlauf wird mit einer elastischen " +
      "Ankerleine verbunden. Die Kettenlänge bleibt fest; " +
      "nur die Leinenlänge wird berechnet oder geprüft."
    );
  }

  updateVisibleFields();
  calculate();
}

function setCalculationMode(mode) {
  calculationMode = mode;

  element("modeRequiredButton")
    .classList.toggle(
      "active",
      mode === "required"
    );

  element("modeAvailableButton")
    .classList.toggle(
      "active",
      mode === "available"
    );

  if (mode === "required") {
    setText(
      "modeDescription",
      gearType === "chain"
        ? "Berechnung der benötigten Kettenlänge für " +
          "einen horizontalen Zug am Anker."
        : "Der Kettenvorlauf bleibt fest. Berechnet wird " +
          "die benötigte unbelastete Ankerleinenlänge."
    );
  } else {
    setText(
      "modeDescription",
      gearType === "chain"
        ? "Eine vorhandene Kettenlänge wird auf " +
          "Bodenkontakt und Ankerwinkel geprüft."
        : "Die vorhandenen Längen von Kettenvorlauf und " +
          "Ankerleine werden geprüft."
    );
  }

  updateVisibleFields();
  calculate();
}

function updateVisibleFields() {
  const chainOnly =
    gearType === "chain";

  element("chainRequiredFields")
    .classList.toggle(
      "hidden",
      !chainOnly ||
      calculationMode !== "required"
    );

  element("chainAvailableFields")
    .classList.toggle(
      "hidden",
      !chainOnly ||
      calculationMode !== "available"
    );

  element("combinationRequiredFields")
    .classList.toggle(
      "hidden",
      chainOnly ||
      calculationMode !== "required"
    );

  element("combinationAvailableFields")
    .classList.toggle(
      "hidden",
      chainOnly ||
      calculationMode !== "available"
    );

  document
    .querySelectorAll(".rope-result")
    .forEach(card => {
      card.classList.toggle(
        "hidden",
        chainOnly
      );
    });
}

/*
 * =============================================================
 * REINE KETTE
 * =============================================================
 */

function calculateRequiredChain(data) {
  const requiredSuspendedLength =
    Math.sqrt(
      data.height * data.height +
      2 *
      data.horizontalForce *
      data.height /
      data.chainWeightPerMeter
    );

  const geometry =
    calculateChainGeometry(
      data.horizontalForce,
      data.chainWeightPerMeter,
      requiredSuspendedLength,
      0
    );

  const seabedLength =
    data.input.chainSeabedReserve;

  return {
    ...data,
    gearType: "chain",
    mode: "required",
    chainLength:
      requiredSuspendedLength +
      seabedLength,
    suspendedChainLength:
      requiredSuspendedLength,
    seabedChainLength:
      seabedLength,
    horizontalSpan:
      geometry.horizontalSpan +
      seabedLength,
    anchorAngle: 0,
    anchorTension:
      data.horizontalForce,
    bowTension:
      geometry.upperTension,
    verticalForceAtAnchor: 0,
    chainGeometry: geometry,
    hasSeabedContact: true,
    rope: null
  };
}

function calculateAvailableChain(data) {
  const chainLength =
    data.input.availableChainLength;

  if (chainLength <= data.height) {
    throw new Error(
      "Die vorhandene Kette muss länger als der vertikale " +
      "Abstand zwischen Anker und Bugrolle sein."
    );
  }

  const requiredSuspendedLength =
    Math.sqrt(
      data.height * data.height +
      2 *
      data.horizontalForce *
      data.height /
      data.chainWeightPerMeter
    );

  if (chainLength >= requiredSuspendedLength) {
    const seabedLength =
      chainLength -
      requiredSuspendedLength;

    const geometry =
      calculateChainGeometry(
        data.horizontalForce,
        data.chainWeightPerMeter,
        requiredSuspendedLength,
        0
      );

    return {
      ...data,
      gearType: "chain",
      mode: "available",
      chainLength,
      suspendedChainLength:
        requiredSuspendedLength,
      seabedChainLength:
        seabedLength,
      horizontalSpan:
        seabedLength +
        geometry.horizontalSpan,
      anchorAngle: 0,
      anchorTension:
        data.horizontalForce,
      bowTension:
        geometry.upperTension,
      verticalForceAtAnchor: 0,
      chainGeometry: geometry,
      hasSeabedContact: true,
      requiredSuspendedLength,
      rope: null
    };
  }

  let lower = 0;
  let upper = Math.max(
    data.horizontalForce,
    data.chainWeightPerMeter *
    chainLength
  );

  for (let index = 0; index < 100; index++) {
    const geometry =
      calculateChainGeometry(
        data.horizontalForce,
        data.chainWeightPerMeter,
        chainLength,
        upper
      );

    if (geometry.verticalRise >= data.height) {
      break;
    }

    upper *= 2;
  }

  for (let index = 0; index < 120; index++) {
    const midpoint =
      (lower + upper) / 2;

    const geometry =
      calculateChainGeometry(
        data.horizontalForce,
        data.chainWeightPerMeter,
        chainLength,
        midpoint
      );

    if (geometry.verticalRise < data.height) {
      lower = midpoint;
    } else {
      upper = midpoint;
    }
  }

  const verticalForceAtAnchor =
    (lower + upper) / 2;

  const geometry =
    calculateChainGeometry(
      data.horizontalForce,
      data.chainWeightPerMeter,
      chainLength,
      verticalForceAtAnchor
    );

  return {
    ...data,
    gearType: "chain",
    mode: "available",
    chainLength,
    suspendedChainLength: chainLength,
    seabedChainLength: 0,
    horizontalSpan:
      geometry.horizontalSpan,
    anchorAngle:
      Math.atan2(
        verticalForceAtAnchor,
        data.horizontalForce
      ) *
      180 /
      Math.PI,
    anchorTension:
      geometry.lowerTension,
    bowTension:
      geometry.upperTension,
    verticalForceAtAnchor,
    chainGeometry: geometry,
    hasSeabedContact: false,
    requiredSuspendedLength,
    rope: null
  };
}

/*
 * =============================================================
 * KETTENVORLAUF + ANKERLEINE
 * =============================================================
 */

function calculateCombinationRequired(data) {
  const rope =
    ROPE_LIBRARY[data.input.ropePreset];

  const chainLength =
    data.input.chainLeadLength;

  const seabedLength =
    data.input.combinationSeabedReserve;

  const suspendedChainLength =
    chainLength - seabedLength;

  const chainGeometry =
    calculateChainGeometry(
      data.horizontalForce,
      data.chainWeightPerMeter,
      suspendedChainLength,
      0
    );

  if (
    chainGeometry.verticalRise >=
    data.height
  ) {
    throw new Error(
      "Der frei hängende Kettenvorlauf steigt bereits bis " +
      "über die Bugrolle. Vergrößere die Kettenreserve auf " +
      "dem Boden oder verkürze den Kettenvorlauf."
    );
  }

  const ropeTension =
    chainGeometry.upperTension;

  const strainPercent =
    interpolateRopeStrain(
      ropeTension,
      rope
    );

  const sineAngle =
    chainGeometry.verticalForceAtUpperEnd /
    ropeTension;

  const cosineAngle =
    data.horizontalForce /
    ropeTension;

  if (sineAngle <= 1e-9) {
    throw new Error(
      "Der frei hängende Kettenanteil ist zu klein, um " +
      "die Ankerleine zur Bugrolle ansteigen zu lassen."
    );
  }

  const ropeVerticalRise =
    data.height -
    chainGeometry.verticalRise;

  const ropeLoadedLength =
    ropeVerticalRise / sineAngle;

  const ropeUnloadedLength =
    ropeLoadedLength /
    (1 + strainPercent / 100);

  const ropeExtension =
    ropeLoadedLength -
    ropeUnloadedLength;

  const ropeHorizontalSpan =
    ropeLoadedLength *
    cosineAngle;

  return {
    ...data,
    gearType: "combination",
    mode: "required",
    chainLength,
    suspendedChainLength,
    seabedChainLength: seabedLength,
    chainGeometry,
    horizontalSpan:
      seabedLength +
      chainGeometry.horizontalSpan +
      ropeHorizontalSpan,
    anchorAngle: 0,
    anchorTension:
      data.horizontalForce,
    bowTension:
      ropeTension,
    verticalForceAtAnchor: 0,
    hasSeabedContact: true,

    rope: {
      data: rope,
      unloadedLength:
        ropeUnloadedLength,
      loadedLength:
        ropeLoadedLength,
      extension:
        ropeExtension,
      strainPercent,
      tension:
        ropeTension,
      horizontalSpan:
        ropeHorizontalSpan,
      verticalRise:
        ropeVerticalRise,
      angleDegrees:
        Math.asin(sineAngle) *
        180 /
        Math.PI,
      utilizationPercent:
        ropeTension /
        rope.meanBreakingLoadN *
        100
    }
  };
}

function combinationVerticalHeightWithContact(
  suspendedChainLength,
  data,
  rope
) {
  const chainGeometry =
    calculateChainGeometry(
      data.horizontalForce,
      data.chainWeightPerMeter,
      suspendedChainLength,
      0
    );

  const ropeTension =
    chainGeometry.upperTension;

  const ropeLength =
    calculateLoadedRopeLength(
      data.input.availableRopeLength,
      ropeTension,
      rope
    );

  const sineAngle =
    chainGeometry.verticalForceAtUpperEnd /
    ropeTension;

  return {
    totalHeight:
      chainGeometry.verticalRise +
      ropeLength.loadedLength *
      sineAngle,
    chainGeometry,
    ropeLength,
    ropeTension,
    sineAngle
  };
}

function combinationVerticalHeightLifted(
  verticalForceAtAnchor,
  data,
  rope
) {
  const chainGeometry =
    calculateChainGeometry(
      data.horizontalForce,
      data.chainWeightPerMeter,
      data.input.chainLeadLength,
      verticalForceAtAnchor
    );

  const ropeTension =
    chainGeometry.upperTension;

  const ropeLength =
    calculateLoadedRopeLength(
      data.input.availableRopeLength,
      ropeTension,
      rope
    );

  const sineAngle =
    chainGeometry.verticalForceAtUpperEnd /
    ropeTension;

  return {
    totalHeight:
      chainGeometry.verticalRise +
      ropeLength.loadedLength *
      sineAngle,
    chainGeometry,
    ropeLength,
    ropeTension,
    sineAngle
  };
}

function calculateCombinationAvailable(data) {
  const rope =
    ROPE_LIBRARY[data.input.ropePreset];

  const chainLength =
    data.input.chainLeadLength;

  if (
    data.horizontalForce >=
    rope.maximumMeasuredCurveForceN
  ) {
    throw new Error(
      "Bereits die horizontale Kraft liegt oberhalb des " +
      "gemessenen Kennlinienbereichs der ausgewählten Leine."
    );
  }

  const maximumVerticalForceAtRope =
    Math.sqrt(
      rope.maximumMeasuredCurveForceN ** 2 -
      data.horizontalForce ** 2
    );

  const maximumSuspendedChainByCurve =
    maximumVerticalForceAtRope /
    data.chainWeightPerMeter;

  const contactUpperLength =
    Math.min(
      chainLength,
      maximumSuspendedChainByCurve
    );

  const upperContact =
    combinationVerticalHeightWithContact(
      contactUpperLength,
      data,
      rope
    );

  /*
   * Es gibt eine Lösung mit Kette auf dem Boden.
   */
  if (
    upperContact.totalHeight >=
    data.height
  ) {
    let lower = 0;
    let upper = contactUpperLength;

    for (let index = 0; index < 120; index++) {
      const midpoint =
        (lower + upper) / 2;

      const trial =
        combinationVerticalHeightWithContact(
          midpoint,
          data,
          rope
        );

      if (trial.totalHeight < data.height) {
        lower = midpoint;
      } else {
        upper = midpoint;
      }
    }

    const suspendedChainLength =
      (lower + upper) / 2;

    const solution =
      combinationVerticalHeightWithContact(
        suspendedChainLength,
        data,
        rope
      );

    const seabedChainLength =
      chainLength -
      suspendedChainLength;

    const cosineAngle =
      data.horizontalForce /
      solution.ropeTension;

    const ropeHorizontalSpan =
      solution.ropeLength.loadedLength *
      cosineAngle;

    return {
      ...data,
      gearType: "combination",
      mode: "available",
      chainLength,
      suspendedChainLength,
      seabedChainLength,
      chainGeometry:
        solution.chainGeometry,
      horizontalSpan:
        seabedChainLength +
        solution.chainGeometry.horizontalSpan +
        ropeHorizontalSpan,
      anchorAngle: 0,
      anchorTension:
        data.horizontalForce,
      bowTension:
        solution.ropeTension,
      verticalForceAtAnchor: 0,
      hasSeabedContact: true,

      rope: {
        data: rope,
        unloadedLength:
          data.input.availableRopeLength,
        loadedLength:
          solution.ropeLength.loadedLength,
        extension:
          solution.ropeLength.extension,
        strainPercent:
          solution.ropeLength.strainPercent,
        tension:
          solution.ropeTension,
        horizontalSpan:
          ropeHorizontalSpan,
        verticalRise:
          solution.ropeLength.loadedLength *
          solution.sineAngle,
        angleDegrees:
          Math.asin(solution.sineAngle) *
          180 /
          Math.PI,
        utilizationPercent:
          solution.ropeTension /
          rope.meanBreakingLoadN *
          100
      }
    };
  }

  /*
   * Wenn schon die vollständig freihängende Kette außerhalb
   * des gemessenen Kennlinienbereichs liegt, wird nicht
   * extrapoliert.
   */
  if (
    chainLength >
    maximumSuspendedChainByCurve
  ) {
    throw new Error(
      "Die gesamte Kette müsste abheben, dabei würde die " +
      "Leinenkraft jedoch den gemessenen Kennlinienbereich " +
      "überschreiten."
    );
  }

  /*
   * Gesamte Kette angehoben. Gesucht ist die vertikale
   * Kraft am Anker.
   */
  const maximumVerticalForceAtAnchor =
    maximumVerticalForceAtRope -
    data.chainWeightPerMeter *
    chainLength;

  if (maximumVerticalForceAtAnchor <= 0) {
    throw new Error(
      "Für die vorgegebenen Längen gibt es innerhalb des " +
      "gemessenen Leinenbereichs keine Lösung."
    );
  }

  const maximumTrial =
    combinationVerticalHeightLifted(
      maximumVerticalForceAtAnchor,
      data,
      rope
    );

  if (
    maximumTrial.totalHeight <
    data.height
  ) {
    throw new Error(
      "Kettenvorlauf und Ankerleine sind zu kurz, um die " +
      "Bugrolle innerhalb des gemessenen Leinenbereichs zu " +
      "erreichen."
    );
  }

  let lower = 0;
  let upper =
    maximumVerticalForceAtAnchor;

  for (let index = 0; index < 120; index++) {
    const midpoint =
      (lower + upper) / 2;

    const trial =
      combinationVerticalHeightLifted(
        midpoint,
        data,
        rope
      );

    if (trial.totalHeight < data.height) {
      lower = midpoint;
    } else {
      upper = midpoint;
    }
  }

  const verticalForceAtAnchor =
    (lower + upper) / 2;

  const solution =
    combinationVerticalHeightLifted(
      verticalForceAtAnchor,
      data,
      rope
    );

  const cosineAngle =
    data.horizontalForce /
    solution.ropeTension;

  const ropeHorizontalSpan =
    solution.ropeLength.loadedLength *
    cosineAngle;

  return {
    ...data,
    gearType: "combination",
    mode: "available",
    chainLength,
    suspendedChainLength: chainLength,
    seabedChainLength: 0,
    chainGeometry:
      solution.chainGeometry,
    horizontalSpan:
      solution.chainGeometry.horizontalSpan +
      ropeHorizontalSpan,
    anchorAngle:
      Math.atan2(
        verticalForceAtAnchor,
        data.horizontalForce
      ) *
      180 /
      Math.PI,
    anchorTension:
      solution.chainGeometry.lowerTension,
    bowTension:
      solution.ropeTension,
    verticalForceAtAnchor,
    hasSeabedContact: false,

    rope: {
      data: rope,
      unloadedLength:
        data.input.availableRopeLength,
      loadedLength:
        solution.ropeLength.loadedLength,
      extension:
        solution.ropeLength.extension,
      strainPercent:
        solution.ropeLength.strainPercent,
      tension:
        solution.ropeTension,
      horizontalSpan:
        ropeHorizontalSpan,
      verticalRise:
        solution.ropeLength.loadedLength *
        solution.sineAngle,
      angleDegrees:
        Math.asin(solution.sineAngle) *
        180 /
        Math.PI,
      utilizationPercent:
        solution.ropeTension /
        rope.meanBreakingLoadN *
        100
    }
  };
}

/*
 * =============================================================
 * HAUPTBERECHNUNG
 * =============================================================
 */

function calculate() {
  hideError();

  try {
    const input = readInput();
    validateInput(input);

    const height =
      input.waterDepth +
      input.additionalWater +
      input.bowHeight;

    let baseHorizontalForce;
    let windResult = null;

    if (input.loadSource === "wind") {
      windResult =
        calculateWindLoad(
          input.windSpeedKnots,
          input.effectiveWindArea
        );

      baseHorizontalForce =
        windResult.force;
    } else {
      baseHorizontalForce =
        input.horizontalLoadKN * 1000;
    }

    const horizontalForce =
      baseHorizontalForce *
      input.loadFactor;

    const buoyancyFactor =
      1 -
      WATER_DENSITY /
      STEEL_DENSITY;

    const chainWeightPerMeter =
      input.chainMass *
      GRAVITY *
      buoyancyFactor;

    const data = {
      input,
      height,
      baseHorizontalForce,
      horizontalForce,
      windResult,
      chainWeightPerMeter
    };

    let result;

    if (gearType === "chain") {
      result =
        calculationMode === "required"
          ? calculateRequiredChain(data)
          : calculateAvailableChain(data);
    } else {
      result =
        calculationMode === "required"
          ? calculateCombinationRequired(data)
          : calculateCombinationAvailable(data);
    }

    displayResult(result);
    drawDiagram(result);
  } catch (error) {
    showError(error.message);
  }
}

/*
 * =============================================================
 * ERGEBNISANZEIGE
 * =============================================================
 */

function displayResult(result) {
  if (result.gearType === "chain") {
    setText(
      "primaryResultLabel",
      result.mode === "required"
        ? "Benötigte Kettenlänge"
        : "Vorhandene Kettenlänge"
    );

    setText(
      "primaryResultValue",
      formatMeters(result.chainLength)
    );

    setText(
      "primaryResultDetail",
      "Gesamte Kette zwischen Anker und Bugrolle"
    );
  } else {
    setText(
      "primaryResultLabel",
      result.mode === "required"
        ? "Benötigte unbelastete Leine"
        : "Vorhandene unbelastete Leine"
    );

    setText(
      "primaryResultValue",
      formatMeters(
        result.rope.unloadedLength
      )
    );

    setText(
      "primaryResultDetail",
      "Kettenvorlauf bleibt unverändert"
    );
  }

  setText(
    "horizontalForceResult",
    formatKilonewtons(
      result.horizontalForce
    )
  );

  setText(
    "heightResult",
    formatMeters(result.height)
  );

  setText(
    "horizontalSpanResult",
    formatMeters(result.horizontalSpan)
  );

  setText(
    "chainLengthResult",
    formatMeters(result.chainLength)
  );

  setText(
    "suspendedChainResult",
    formatMeters(
      result.suspendedChainLength
    )
  );

  setText(
    "seabedChainResult",
    formatMeters(
      result.seabedChainLength
    )
  );

  setText(
    "anchorAngleResult",
    formatNumber(
      result.anchorAngle,
      2
    ) + "°"
  );

  setText(
    "anchorTensionResult",
    formatKilonewtons(
      result.anchorTension
    )
  );

  setText(
    "bowTensionResult",
    formatKilonewtons(
      result.bowTension
    )
  );

  setText(
    "chainWeightResult",
    formatNumber(
      result.chainWeightPerMeter,
      2
    ) + " N/m"
  );

  if (result.rope) {
    setText(
      "ropeNameResult",
      result.rope.data.manufacturer +
      " " +
      result.rope.data.product +
      " " +
      result.rope.data.diameterMm +
      " mm"
    );

    setText(
      "ropeUnloadedLengthResult",
      formatMeters(
        result.rope.unloadedLength
      )
    );

    setText(
      "ropeLoadedLengthResult",
      formatMeters(
        result.rope.loadedLength
      )
    );

    setText(
      "ropeExtensionResult",
      formatMeters(
        result.rope.extension
      )
    );

    setText(
      "ropeStrainResult",
      formatPercent(
        result.rope.strainPercent
      )
    );

    setText(
      "ropeTensionResult",
      formatKilonewtons(
        result.rope.tension
      )
    );

    setText(
      "ropeUtilizationResult",
      formatPercent(
        result.rope.utilizationPercent
      )
    );
  }

  updateMainStatus(result);
  updateStrengthStatus(result);
  updateWindPreview(result);
}

function updateMainStatus(result) {
  if (result.gearType === "chain") {
    if (result.mode === "required") {
      setStatus(
        "mainStatus",
        "success",
        "Für einen horizontalen Kettenzug am Anker werden " +
        formatMeters(result.suspendedChainLength) +
        " freihängende Kette benötigt. Mit der gewünschten " +
        "Bodenreserve beträgt die Gesamtlänge " +
        formatMeters(result.chainLength) +
        "."
      );

      return;
    }

    if (result.hasSeabedContact) {
      setStatus(
        "mainStatus",
        result.seabedChainLength < 0.5
          ? "warning"
          : "success",
        "Die Kette liegt im Modell noch mit " +
        formatMeters(result.seabedChainLength) +
        " auf dem Boden. Der Winkel am Anker beträgt 0°."
      );
    } else {
      setStatus(
        "mainStatus",
        "danger",
        "Die gesamte Kette ist vom Boden abgehoben. " +
        "Der Winkel am Anker beträgt " +
        formatNumber(result.anchorAngle, 2) +
        "°."
      );
    }

    return;
  }

  if (result.mode === "required") {
    setStatus(
      "mainStatus",
      result.rope.utilizationPercent <= 20
        ? "success"
        : "warning",
      "Bei festem Kettenvorlauf von " +
      formatMeters(result.chainLength) +
      " werden " +
      formatMeters(result.rope.unloadedLength) +
      " unbelastete Ankerleine benötigt. Unter der " +
      "berechneten Last verlängert sie sich auf " +
      formatMeters(result.rope.loadedLength) +
      "."
    );

    return;
  }

  if (result.hasSeabedContact) {
    setStatus(
      "mainStatus",
      result.seabedChainLength < 0.5
        ? "warning"
        : "success",
      "Die Kombination erreicht die Bugrolle. " +
      formatMeters(result.seabedChainLength) +
      " des Kettenvorlaufs liegen auf dem Boden. " +
      "Der Ankerwinkel beträgt 0°."
    );
  } else {
    setStatus(
      "mainStatus",
      "danger",
      "Der Kettenvorlauf ist vollständig abgehoben. " +
      "Der Winkel am Anker beträgt " +
      formatNumber(result.anchorAngle, 2) +
      "°."
    );
  }
}

function updateStrengthStatus(result) {
  const messages = [];
  let statusType = "success";

  if (
    result.input.chainWorkingLoadKN > 0
  ) {
    const workingLoad =
      result.input.chainWorkingLoadKN *
      1000;

    const maximumChainTension =
      Math.max(
        result.anchorTension,
        result.chainGeometry.upperTension
      );

    const chainUtilization =
      maximumChainTension /
      workingLoad *
      100;

    messages.push(
      "Kettenauslastung bezogen auf die eingegebene " +
      "Arbeitslast: " +
      formatPercent(chainUtilization) +
      "."
    );

    if (chainUtilization > 100) {
      statusType = "danger";
    } else if (
      chainUtilization > 80 &&
      statusType !== "danger"
    ) {
      statusType = "warning";
    }
  } else {
    messages.push(
      "Keine Kettenfestigkeitsprüfung, da keine " +
      "Arbeitslast eingegeben wurde."
    );
  }

  if (result.rope) {
    const utilization =
      result.rope.utilizationPercent;

    messages.push(
      "Leinenauslastung bezogen auf die mittlere " +
      "gemessene Bruchlast: " +
      formatPercent(utilization) +
      "."
    );

    if (utilization >= 100) {
      statusType = "danger";
    } else if (
      utilization > 50
    ) {
      statusType = "danger";
    } else if (
      utilization > 20 &&
      statusType !== "danger"
    ) {
      statusType = "warning";
    }
  }

  setStatus(
    "strengthStatus",
    statusType,
    messages.join(" ")
  );
}

function updateWindPreview(result) {
  if (!result.windResult) {
    return;
  }

  element("windPreview").innerHTML =
    "<strong>Statische Windlast:</strong> " +
    formatKilonewtons(
      result.baseHorizontalForce
    ) +
    "<br>" +
    "Windgeschwindigkeit: " +
    formatNumber(
      result.windResult.speedMetersPerSecond,
      2
    ) +
    " m/s<br>" +
    "Dynamischer Winddruck: " +
    formatNumber(
      result.windResult.dynamicPressure,
      1
    ) +
    " N/m²<br>" +
    "Horizontallast nach Faktor: <strong>" +
    formatKilonewtons(
      result.horizontalForce
    ) +
    "</strong>";
}

/*
 * =============================================================
 * GRAFIK
 * =============================================================
 */

function createChainPoints(
  result,
  startX,
  count
) {
  const points = [];

  const horizontalForce =
    result.horizontalForce;

  const weightPerMeter =
    result.chainWeightPerMeter;

  const lowerVerticalForce =
    result.verticalForceAtAnchor;

  const lowerTension =
    Math.hypot(
      horizontalForce,
      lowerVerticalForce
    );

  const lowerAsinh =
    Math.asinh(
      lowerVerticalForce /
      horizontalForce
    );

  for (let index = 0; index <= count; index++) {
    const arcLength =
      result.suspendedChainLength *
      index /
      count;

    const verticalForce =
      lowerVerticalForce +
      weightPerMeter *
      arcLength;

    const modelX =
      startX +
      horizontalForce /
      weightPerMeter *
      (
        Math.asinh(
          verticalForce /
          horizontalForce
        ) -
        lowerAsinh
      );

    const modelY =
      (
        Math.hypot(
          horizontalForce,
          verticalForce
        ) -
        lowerTension
      ) /
      weightPerMeter;

    points.push({
      x: modelX,
      y: modelY
    });
  }

  return points;
}

function drawDiagram(result) {
  const svg = element("diagram");

  const width = 900;
  const height = 460;

  const left = 65;
  const right = 55;
  const top = 45;
  const bottom = 75;

  const plotWidth =
    width - left - right;

  const plotHeight =
    height - top - bottom;

  const maximumX =
    Math.max(
      result.horizontalSpan,
      0.1
    );

  const maximumY =
    Math.max(
      result.height,
      0.1
    );

  function mapX(value) {
    return (
      left +
      value /
      maximumX *
      plotWidth
    );
  }

  function mapY(value) {
    return (
      height -
      bottom -
      value /
      maximumY *
      plotHeight
    );
  }

  const seabedLength =
    result.seabedChainLength;

  const chainPoints = [];

  if (result.hasSeabedContact) {
    chainPoints.push({
      x: 0,
      y: 0
    });

    chainPoints.push({
      x: seabedLength,
      y: 0
    });
  }

  const suspendedPoints =
    createChainPoints(
      result,
      seabedLength,
      140
    );

  chainPoints.push(...suspendedPoints);

  const chainPolyline =
    chainPoints
      .map(point => {
        return (
          mapX(point.x) +
          "," +
          mapY(point.y)
        );
      })
      .join(" ");

  const chainEnd =
    suspendedPoints[
      suspendedPoints.length - 1
    ];

  const boatPoint = {
    x: result.horizontalSpan,
    y: result.height
  };

  const waterSurfaceHeight =
    result.height -
    result.input.bowHeight;

  const waterY =
    mapY(
      clamp(
        waterSurfaceHeight,
        0,
        result.height
      )
    );

  const floorY = mapY(0);

  const ropeSvg =
    result.rope
      ? `
        <line
          x1="${mapX(chainEnd.x)}"
          y1="${mapY(chainEnd.y)}"
          x2="${mapX(boatPoint.x)}"
          y2="${mapY(boatPoint.y)}"
          stroke="#e87917"
          stroke-width="5"
          stroke-linecap="round"
        />

        <circle
          cx="${mapX(chainEnd.x)}"
          cy="${mapY(chainEnd.y)}"
          r="6"
          fill="#e87917"
        />

        <text
          x="${mapX(chainEnd.x)}"
          y="${mapY(chainEnd.y) - 12}"
          text-anchor="middle"
          fill="#9a3412"
          font-size="12"
        >
          Kette / Leine
        </text>
      `
      : "";

  const touchdownSvg =
    result.hasSeabedContact
      ? `
        <circle
          cx="${mapX(seabedLength)}"
          cy="${floorY}"
          r="6"
          fill="#f59e0b"
        />

        <text
          x="${mapX(seabedLength)}"
          y="${floorY + 27}"
          text-anchor="middle"
          fill="#78350f"
          font-size="12"
        >
          Ablösepunkt
        </text>
      `
      : "";

  svg.innerHTML = `
    <defs>
      <linearGradient
        id="waterGradient"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0%"
          stop-color="#bae6fd"
          stop-opacity="0.82"
        />

        <stop
          offset="100%"
          stop-color="#38bdf8"
          stop-opacity="0.36"
        />
      </linearGradient>
    </defs>

    <rect
      x="0"
      y="0"
      width="${width}"
      height="${waterY}"
      fill="#f0f9ff"
    />

    <rect
      x="0"
      y="${waterY}"
      width="${width}"
      height="${floorY - waterY}"
      fill="url(#waterGradient)"
    />

    <line
      x1="0"
      y1="${waterY}"
      x2="${width}"
      y2="${waterY}"
      stroke="#0284c7"
      stroke-width="2"
      stroke-dasharray="8 5"
    />

    <text
      x="75"
      y="${Math.max(20, waterY - 8)}"
      fill="#0369a1"
      font-size="13"
    >
      Wasseroberfläche
    </text>

    <rect
      x="0"
      y="${floorY}"
      width="${width}"
      height="${height - floorY}"
      fill="#d6b47a"
    />

    <line
      x1="0"
      y1="${floorY}"
      x2="${width}"
      y2="${floorY}"
      stroke="#a16207"
      stroke-width="3"
    />

    <polyline
      points="${chainPolyline}"
      fill="none"
      stroke="#1e293b"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    ${ropeSvg}
    ${touchdownSvg}

    <circle
      cx="${mapX(0)}"
      cy="${floorY}"
      r="8"
      fill="#b91c1c"
    />

    <text
      x="${mapX(0) + 12}"
      y="${floorY - 13}"
      fill="#7f1d1d"
      font-size="14"
      font-weight="700"
    >
      Anker
    </text>

    <circle
      cx="${mapX(boatPoint.x)}"
      cy="${mapY(boatPoint.y)}"
      r="8"
      fill="#0369a1"
    />

    <text
      x="${mapX(boatPoint.x) - 8}"
      y="${mapY(boatPoint.y) + 25}"
      text-anchor="end"
      fill="#075985"
      font-size="14"
      font-weight="700"
    >
      Bugrolle
    </text>

    <line
      x1="${mapX(boatPoint.x)}"
      y1="${floorY}"
      x2="${mapX(boatPoint.x)}"
      y2="${mapY(boatPoint.y)}"
      stroke="#64748b"
      stroke-dasharray="5 5"
    />

    <text
      x="${mapX(boatPoint.x) - 8}"
      y="${
        (
          floorY +
          mapY(boatPoint.y)
        ) / 2
      }"
      text-anchor="end"
      fill="#475569"
      font-size="12"
    >
      h = ${formatNumber(result.height)} m
    </text>

    <line
      x1="${mapX(0)}"
      y1="${height - 26}"
      x2="${mapX(boatPoint.x)}"
      y2="${height - 26}"
      stroke="#475569"
    />

    <text
      x="${
        (
          mapX(0) +
          mapX(boatPoint.x)
        ) / 2
      }"
      y="${height - 39}"
      text-anchor="middle"
      fill="#334155"
      font-size="13"
    >
      ${formatNumber(result.horizontalSpan)} m
    </text>
  `;
}

/*
 * =============================================================
 * EVENT-LISTENER UND INITIALISIERUNG
 * =============================================================
 */

element("gearChainButton")
  .addEventListener(
    "click",
    () => setGearType("chain")
  );

element("gearCombinationButton")
  .addEventListener(
    "click",
    () => setGearType("combination")
  );

element("modeRequiredButton")
  .addEventListener(
    "click",
    () => setCalculationMode("required")
  );

element("modeAvailableButton")
  .addEventListener(
    "click",
    () => setCalculationMode("available")
  );

element("chainPreset")
  .addEventListener(
    "change",
    updateChainSelection
  );

element("ropePreset")
  .addEventListener(
    "change",
    updateRopeInformation
  );

element("loadSource")
  .addEventListener(
    "change",
    updateLoadSource
  );

element("calculateButton")
  .addEventListener(
    "click",
    calculate
  );

document
  .querySelectorAll("input")
  .forEach(input => {
    input.addEventListener(
      "input",
      calculate
    );
  });

updateChainSelection();
updateLoadSource();
updateRopeInformation();
setGearType("chain");
setCalculationMode("required");