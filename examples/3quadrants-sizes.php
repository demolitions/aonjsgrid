<?php

$maxcols = 18;

for ($cols = 1; $cols <= $maxcols; $cols++) {
//  cols : X = maxcols : 1 -> X = cols / maxcols
  $qwidth = floor(($cols / $maxcols) * 100);

  echo '.quadrant[data-size-x="' . $cols . '"] { width: ' . $qwidth . '%; }' . "\n";
  for ($ic = 1; $ic <= $cols; $ic++) {
    // ic : X = cols = 1 -> X = ic / cols
    $iw = ceil(($ic / $cols) * 10000) / 100;
    $ip = floor((($ic - 1) / $cols) * 10000) / 100;

    echo '.quadrant[data-size-x="' . $cols . '"] .item[data-size-x="' . $ic . '"] { width: ' . $iw . '%; }' . "\n";
    echo '.quadrant[data-size-x="' . $cols . '"] .item[data-pos-x="' . ($ic - 1) . '"] { left: ' . $ip . '%; }' . "\n";
  }
}
