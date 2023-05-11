import {
	LARGE_WINDOW_WIDTH,
	MEDIUM_WINDOW_WIDTH,
	SMALL_WINDOW_WIDTH,
	XX_LARGE_WINDOW_WIDTH,
	X_LARGE_WINDOW_WIDTH
} from "./config/constants";

import { getConfigurationObject } from "./helper/helper";
import { defaultSCStyles } from "./styledComponents/DefaultSCStyles";
import { largeSCStyles } from "./styledComponents/LargeSCStyles";
import { mediumSCStyles } from "./styledComponents/MediumSCStyles";
import { smallSCStyles } from "./styledComponents/SmallSCStyles";
import { xLargeSCStyles } from "./styledComponents/XLargeSCStyles";
import { xXLargeSCStyles } from "./styledComponents/XXLargeSCStyles";
import { appStyles, coreStyles } from "./StylesProvider";
import { defaultUtilityStyles } from "./utility/DefaultUtilityStyles";
import { largeUtilityStyles } from "./utility/LargeUtilityStyles";
import { mediumUtilityStyles } from "./utility/MediumUtilityStyles";
import { smallUtilityStyles } from "./utility/SmallUtilityStyles";
import UtilityClasses from "./utility/UtilityClasses";
import { xLargeUtilityStyles } from "./utility/XLargeUtilityStyles";
import { xXLargeUtilityStyles } from "./utility/XXLargeUtilityStyles";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

const UNITS = ["!important"];
const EXCEPTIONS = [
	"flexGrow",
	"flexShrink",
	"opacity",
	"top",
	"bottom",
	"left",
	"right",
];

let mergedDefaultStyles = {
	...appStyles?.styles?.default,
	...coreStyles?.styles?.default,
	...defaultUtilityStyles,
	...defaultSCStyles,
};

let mergedSmallStyles = {
	...appStyles?.styles?.small,
	...coreStyles?.styles?.small,
	...smallUtilityStyles,
	...smallSCStyles,
};
let mergedMediumStyles = {
	...appStyles?.styles?.medium,
	...coreStyles?.styles?.medium,
	...mediumUtilityStyles,
	...mediumSCStyles,
};
let mergedLargeStyles = {
	...appStyles?.styles?.large,
	...coreStyles?.styles?.large,
	...largeUtilityStyles,
	...largeSCStyles,
};
let mergedXLargeStyles = {
	...appStyles?.styles?.xLarge,
	...coreStyles?.styles?.xLarge,
	...xLargeUtilityStyles,
	...xLargeSCStyles,
};
let mergedXXLargeStyles = {
	...appStyles?.styles?.xxLarge,
	...coreStyles?.styles?.xxLarge,
	...xXLargeUtilityStyles,
	...xXLargeSCStyles,
};

const sanitizeClassNames = (classNames) => {
	// using set() method to create collections of unique values,
	// hence remove duplicates
	return [
		...new Set(
			classNames && Array.isArray(classNames) ? classNames : [classNames]
		),
	];
};

export function addFlavor(styleObject) {
	let config = getConfigurationObject();

	if (config.wrappid.platform === "mobile") {
		let keys = Object.keys(styleObject);

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let val = styleObject[key];

			for (let j = 0; j < UNITS.length; j++) {
				// eslint-disable-next-line no-console
				console.log("UNIT", UNITS[j]);
				if (val && typeof val === "string") {
					val = val.replace(UNITS[j], "");
				}
			}

			if (!isNaN(val) && !EXCEPTIONS.includes(key)) {
				val = val + "px";
			}

			if (key === "display" && (val === "flex" || val === "flex ")) {
				key = "flex";
				val = 1;
			}
			if (key === "position" && (val === "fixed" || val === "fixed ")) {
				val = "absolute";
			}
			if (key === "border" && (val === "unset" || val === "unset ")) {
				key = "border";
				val = "0px";
			}

			// eslint-disable-next-line no-console
			console.log("KEY:", key, "VAL:", val);
			styleObject[key] = val;
		}
	}

	return styleObject;
}

export function getEffectiveStyle(classNames) {
	/**
   * Step 1: Get default styles(xs) for className
   * Step 2: Get all styles object filter by classNames and window.width
   */

	// console.log(
	//   "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\nAPP STYLES\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",
	//   appStyles
	// );

	let config = getConfigurationObject();

	classNames = sanitizeClassNames(classNames);

	if (config.wrappid.environment === "development") {
		classNames.push(UtilityClasses.DEV_BORDER);
	}

	let styleObject = {};

	classNames.forEach((className) => {
		/**
     * TODO: Framework related discussion needed
     *
     * 1. condition must have range
     * 2. only one condition will apply based on windowWidth
     *    a. we can have else if statements
     *    b. we can return if any one satisfied
     */

		// console.log(`Looking for className = ${className}`);

		// Get default styles
		if (getDefaultStyle(className)) {
			styleObject = { ...styleObject, ...getDefaultStyle(className) };
			// console.log(`Found any class in default for ${className}`);
			// // console.log(`IN SM ${className} ==`);
			// // console.log(styleObject);
		} else {
			// console.log(`Not found any class in default for ${className}`);
		}
		// Get windowWidth specific styles
		if (windowWidth >= SMALL_WINDOW_WIDTH) {
			if (getSmallStyle(className)) {
				styleObject = { ...styleObject, ...getSmallStyle(className) };
				// console.log(`Found any class in SM for ${className}`);
				// // console.log(`IN SM ${className} ==`);
				// // console.log(styleObject);
			} else {
				// console.log(`Not found any class in SM for ${className}`);
			}
		}
		if (windowWidth >= MEDIUM_WINDOW_WIDTH) {
			if (getMediumStyle(className)) {
				styleObject = { ...styleObject, ...getMediumStyle(className) };
				// console.log(`Found any class in MD for ${className}`);
				// // console.log(`IN MD ${className} ==`);
				// // console.log(styleObject);
			} else {
				// console.log(`Not found any class in MD for ${className}`);
			}
		}
		if (windowWidth >= LARGE_WINDOW_WIDTH) {
			if (getLargeStyle(className)) {
				styleObject = { ...styleObject, ...getLargeStyle(className) };
				// console.log(`Found any class in LG for ${className}`);
				// // console.log(`IN LG ${className} ==`);
				// // console.log(styleObject);
			} else {
				// console.log(`Not found any class in LG for ${className}`);
			}
		}
		if (windowWidth >= X_LARGE_WINDOW_WIDTH) {
			if (getXLargeStyle(className)) {
				styleObject = { ...styleObject, ...getXLargeStyle(className) };
				// console.log(`Found any class in XL for ${className}`);
				// // console.log(`IN XL ${className} ==`);
				// // console.log(styleObject);
			} else {
				// console.log(`Not found any class in XL for ${className}`);
			}
		}
		if (windowWidth >= XX_LARGE_WINDOW_WIDTH) {
			if (getXXLargeStyle(className)) {
				styleObject = { ...styleObject, ...getXXLargeStyle(className) };
				// console.log(`Found any class in XXL for ${className}`);
				// // console.log(`IN XXL ${className} ==`);
				// // console.log(styleObject);
			} else {
				// console.log(`Not found any class in XXL for ${className}`);
			}
		}
	});

	// console.log("Combined ==");
	// console.log(styleObject);
	let ob = addFlavor(styleObject);

	// console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\nAPP STYLES\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", ob, classNames);

	return ob;
}

const getDefaultStyle = (className) => {
	return mergedDefaultStyles[className];
};
const getSmallStyle = (className) => {
	return mergedSmallStyles[className];
};
const getMediumStyle = (className) => {
	return mergedMediumStyles[className];
};
const getLargeStyle = (className) => {
	return mergedLargeStyles[className];
};
const getXLargeStyle = (className) => {
	return mergedXLargeStyles[className];
};
const getXXLargeStyle = (className) => {
	return mergedXXLargeStyles[className];
};
