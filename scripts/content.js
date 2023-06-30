// Copyright 2023 Ethan Mallove
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the LicenSE.

let tr_elements = document.querySelectorAll('tbody > tr');

let reportedValueRegEx = /([0-9\.]+)/;
let valueRangeRegEx = /([0-9\.]+)\s+to\s+([0-9\.]+)/;

var matches;

for (var i in tr_elements)
{
    var tr = tr_elements[i];

    var td;
    if ((typeof(tr) != 'object') || (! ('getElementsByTagName' in tr))) {
        continue;
    } else {
        td = tr.getElementsByTagName("td");
    }

    // Each tr is a collection of three td's: "name", "value", "range".
    //
    // HTMLCollection(3) [td.nameCol.srchbl, td.valueCol, td.rangeCol]
    //  0: td.nameCol.srchbl
    //  1: td.valueCol
    //  2: td.rangeCol
    if (td[1] != undefined) {

        // Example reportedValue: '11.22 K/uL'
        var reportedValue = td[1].innerText;

        matches = reportedValueRegEx.exec(reportedValue);

        if (matches == null) {
            console.log("No match on reportedValue. Skipping row.");
            continue;
        }
        reportedValue = parseFloat(matches[0]);

        // Example valueRange: '4.00 to 10.00 K/uL\n4.00 - 10.00 K/uL'
        var valueRange = td[2].innerText;

        matches = valueRangeRegEx.exec(valueRange);
        if (matches == null) {
            console.log("No match on normal value range. Skipping row.");
            continue;
        }
        var minValue = parseFloat(matches[1]);
        var maxValue = parseFloat(matches[2]);

        // FIXME: Accomodate one-sided ranges (max-only and min-only)
        if (reportedValue < minValue ||
            reportedValue > maxValue)
        {
            console.log("Value (%f) is out of range [%f, %f]. Highlighting.", reportedValue, minValue, maxValue);
            td[1].setAttribute("bgcolor", "yellow");
        }

    } else {
        console.log("No td's found, which would contain value and range. Skipping row.");
    }
}
