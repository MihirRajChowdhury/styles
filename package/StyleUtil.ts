/* eslint-disable no-fallthrough */
/* eslint-disable etc/no-commented-out-code */
import {
  LARGE_WINDOW_WIDTH,
  MEDIUM_WINDOW_WIDTH,
  SMALL_WINDOW_WIDTH,
  XX_LARGE_WINDOW_WIDTH,
  X_LARGE_WINDOW_WIDTH
} from "./config/constants";
import { WrappidData } from "./context/WrappidSyncer";
import { getMergedStyles } from "./StylesProvider";
import UtilityClasses from "./utility/UtilityClasses";

const { innerWidth: windowWidth } = window;

const UNITS = ["!important"];
const EXCEPTIONS = [
  "flexGrow",
  "flexShrink",
  "opacity",
  "top",
  "bottom",
  "left",
  "right",
  "zIndex",
  "fontWeight",
];

const sanitizeClassNames = (classNames: string[]): string[] => {
  // using set() method to create collections of unique values,
  // hence remove duplicates
  const sanitizedClassNames = <string[]>(
    Array.from(
      new Set(
        classNames && Array.isArray(classNames) ? classNames : [classNames]
      )
    )
  );

  return [...sanitizedClassNames];
};

export function addFlavor(styleObject: any) {
  const { config } = WrappidData;

  /**
   * @todo web cannot be go in else block
   */
  if (config?.platform === "mobile") {
    const newStyleObject = <any>{};
    const keys = Object.keys(styleObject);
    // Handle border radius separately
    let hasBorderRadius = false;

    const validBorderStyles = ["solid", "dotted", "dashed"];

    // Helper function to normalize border style
    const normalizeBorderStyle = (style: string): string => {
      if (!style) return "solid"; // default to solid

      style = style.toLowerCase().trim();

      // Direct mapping of common border styles
      switch (style) {
        case "none":

        case "hidden":
          return "solid"; // Use solid with 0 width instead

        case "double":

        case "groove":

        case "ridge":

        case "inset":

        case "outset":
          return "solid"; // Fall back to solid for unsupported styles

        case "dotted":

        case "dashed":

        case "solid":
          return style; // Keep supported styles as is

        default:
          return "solid"; // Default fallback
      }
    };

    // Helper function to handle flex display conversion
    const handleFlexDisplay = (displayValue: string, currentStyles: any) => {
      const flexStyles: any = { flex: 1 };

      // Check if flexDirection is already defined in the original styles
      if (currentStyles?.flexDirection) {
        flexStyles.flexDirection = currentStyles.flexDirection;
      } else {
        // Default to 'column' as this is React Native's default
        flexStyles.flexDirection = "row";
      }

      // Handle flex-specific properties
      if (currentStyles?.flexDirection) delete currentStyles.flexDirection;
      if (currentStyles?.flexWrap) flexStyles.flexWrap = currentStyles.flexWrap;
      if (currentStyles?.justifyContent)
        flexStyles.justifyContent = currentStyles.justifyContent;
      if (currentStyles?.alignItems)
        flexStyles.alignItems = currentStyles.alignItems;
      if (currentStyles?.alignContent)
        flexStyles.alignContent = currentStyles.alignContent;
      if (currentStyles?.flexGrow) flexStyles.flexGrow = currentStyles.flexGrow;
      if (currentStyles?.flexShrink)
        flexStyles.flexShrink = currentStyles.flexShrink;
      if (currentStyles?.flexBasis)
        flexStyles.flexBasis = currentStyles.flexBasis;

      return flexStyles;
    };

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let val = styleObject[key];

      for (let j = 0; j < UNITS.length; j++) {
        // eslint-disable-next-line no-console
        //console.log("UNIT", UNITS[j]);
        if (val && typeof val === "string") {
          val = val.replace(UNITS[j], "");
        }
      }

      if (!isNaN(val) && !EXCEPTIONS.includes(key)) {
        val = val + "px";
      }

      // Handle border styles
      if (key.includes("borderStyle")) {
        val = normalizeBorderStyle(val);

        // If borderStyle is 'none' or 'hidden', set borderWidth to 0
        if (val === "solid" && ["none", "hidden"].includes(styleObject[key])) {
          newStyleObject["borderWidth"] = 0;
        }
      }

      // Enhanced border radius handling
      if (key.includes("border")) {
        if (key.includes("Radius")) {
          hasBorderRadius = true;
          // Convert percentage values to numbers if needed
          if (typeof val === "string" && val.includes("%")) {
            // For percentage values, you might want to calculate based on width/height
            // For now, we'll use a reasonable default
            val = parseFloat(val) * 0.01 * 100; // Convert percentage to points
          } else {
            val = parseFloat(val);
          }
        } else if (key === "border" && (val === "unset" || val === "unset ")) {
          val = "0px";
        }
      }

      if (key === "display") {
        if (val?.includes("flex")) {
          // Get all flex-related styles
          const flexStyles = handleFlexDisplay(styleObject);

          // Apply flex styles to newStyleObject
          Object.assign(newStyleObject, flexStyles);

          // Skip to next iteration since we've handled all flex properties
          continue;
        } else {
          continue;
        }
      } else if (
        (key === "height" || key === "minHeight" || key === "maxHeight") &&
        val?.includes("vh")
      ) {
        continue;
      } else if (
        (key === "width" || key === "minWidth" || key === "maxWidth") &&
        val?.includes("vw")
      ) {
        continue;
      } else if (
        key === "position" &&
        (val === "fixed" ||
          val === "fixed " ||
          val === "sticky" ||
          val === "sticky ")
      ) {
        val = "absolute";
      } else if (key === "border" && (val === "unset" || val === "unset ")) {
        key = "border";
        val = "0px";
      } else if (key === "overflowY" || key === "overflowX") {
        continue;
      }

      // Handle flex direction explicitly if it's set
      if (key === "flexDirection") {
        newStyleObject[key] = val;
        continue;
      }

      // for rem
      // for fontSize
      if (key === "fontSize") {
        if (val.includes("rem")) {
          val = remToPx(val);
        }
      }

      //  for margin and padding
      if (key.includes("margin") || key.includes("padding")) {
        val = val.includes("px") ? parseInt(val.replace("px", "").trim()) : val;
      }

      // Check for overflow property and replace 'auto' with a supported value
      if (key.includes("overflow")) {
        if (val === "auto") {
          val = "scroll"; // Replace 'auto' with 'scroll'
        } else if (["visible", "hidden", "scroll"].includes(val)) {
          // - val = val; // Use the original value if it's valid
        } else {
          continue; // Skip to the next property
        }
      }

      // for transform
      if (isValidTransformType(val)) {
        val = cssTransformToReactNative(val);
        console.log(`chnanging the value of the ${key} is ${val}`);
      }

      newStyleObject[key] = val;
    }

    // If borderRadius is present, ensure overflow is handled correctly
    if (hasBorderRadius) {
      // Only set overflow hidden if it hasn't been explicitly set
      // eslint-disable-next-line no-prototype-builtins
      if (!newStyleObject.hasOwnProperty("overflow")) {
        newStyleObject.overflow = "hidden";
      }

      // Ensure the component clips its children
      newStyleObject.clipChildren = true; // Android specific
    }
    return newStyleObject;
  } else {
    return styleObject;
  }
}

export function getEffectiveStyle(classNames: any[]) {
  /**
   * Step 1: Get default styles(xs) for className
   * Step 2: Get all styles object filter by classNames and window.width
   */

  const styles = getMergedStyles();
  const mergedDefaultStyles = styles?.mergedDefaultStyles;
  const mergedLargeStyles = styles?.mergedLargeStyles;
  const mergedMediumStyles = styles?.mergedMediumStyles;
  const mergedSmallStyles = styles?.mergedSmallStyles;
  const mergedXLargeStyles = styles?.mergedXLargeStyles;
  const mergedXXLargeStyles = styles?.mergedXXLargeStyles;

  const { config } = WrappidData;

  classNames = sanitizeClassNames(classNames);

  if (config?.environment === "development") {
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

    // Get default styles
    if (getDefaultStyle(className, mergedDefaultStyles)) {
      styleObject = {
        ...styleObject,
        ...getDefaultStyle(className, mergedDefaultStyles),
      };

      // eslint-disable-next-line no-empty
    } else {
    }
    // Get windowWidth specific styles
    if (windowWidth >= SMALL_WINDOW_WIDTH) {
      if (getSmallStyle(className, mergedSmallStyles)) {
        styleObject = {
          ...styleObject,
          ...getSmallStyle(className, mergedSmallStyles),
        };
        // eslint-disable-next-line no-empty
      } else {
      }
    }
    if (windowWidth >= MEDIUM_WINDOW_WIDTH) {
      if (getMediumStyle(className, mergedMediumStyles)) {
        styleObject = {
          ...styleObject,
          ...getMediumStyle(className, mergedMediumStyles),
        };

        // eslint-disable-next-line no-empty
      } else {
      }
    }
    if (windowWidth >= LARGE_WINDOW_WIDTH) {
      if (getLargeStyle(className, mergedLargeStyles)) {
        styleObject = {
          ...styleObject,
          ...getLargeStyle(className, mergedLargeStyles),
        };
        // eslint-disable-next-line no-empty
      } else {
      }
    }
    if (windowWidth >= X_LARGE_WINDOW_WIDTH) {
      if (getXLargeStyle(className, mergedXLargeStyles)) {
        styleObject = {
          ...styleObject,
          ...getXLargeStyle(className, mergedXLargeStyles),
        };
      } else {
        // eslint-disable-next-line etc/no-commented-out-code
        // console.log(`Not found any class in XL for ${className}`);
      }
    }
    if (windowWidth >= XX_LARGE_WINDOW_WIDTH) {
      if (getXXLargeStyle(className, mergedXXLargeStyles)) {
        styleObject = {
          ...styleObject,
          ...getXXLargeStyle(className, mergedXXLargeStyles),
        };
      } else {
        // eslint-disable-next-line etc/no-commented-out-code
        // console.log(`Not found any class in XXL for ${className}`);
      }
    }
  });

  //add platformspecificFlovour in utils folder
  if (config?.platform === "mobile") {
    return addFlavor(styleObject);
  }

  // eslint-disable-next-line no-console
  // console.log(
  // 	"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\nAPP STYLES\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",
  // 	finalStyleObject,
  // 	classNames
  // );

  return styleObject;
}

const getDefaultStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};
const getSmallStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};
const getMediumStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};
const getLargeStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};
const getXLargeStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};
const getXXLargeStyle = (className: string | any, mergedStyles: any) => {
  return mergedStyles[className];
};

// rem to px util
const remToPx = (remVal: any) => {
  const __root_Font_Size = 16;

  remVal = Number(remVal.substr(0, remVal.indexOf("rem")));

  return __root_Font_Size * remVal;
};
