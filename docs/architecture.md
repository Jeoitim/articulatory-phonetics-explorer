# Architecture

## State and scope

78 pulmonic entries: 59 main-chart symbols plus 19 common extensions. Selected category, free geometry, requested features, and temporal presentation are separate states. Non-pulmonic mechanisms are reserved types and an explanatory lesson only.

## Data flow

Consonant data → shared place/manner gestures → articulation parameters → one layered SVG. No symbol has a separate anatomical drawing. Secondary articulation is represented independently by rounding, dorsal shape and epiglottic constriction. The complete chart's blank cells are distinct from official shaded cells.

## Anatomy and constraints

All anatomy uses the supplied SVG's 800 × 1000 coordinate space. Craniofacial tissue, maxilla, mandible, teeth, velum/uvula, tongue, epiglottis, larynx and overlays are separate paths. Original static tongue and velum are removed before inserting movable structures. Nasal conchae, bone hatching and muscle fibers are explanatory additions, not measured tissue anatomy.

The five tongue controls form a limited Hermite surface and rounded ventral contour. Dragging distributes displacement over neighboring regions with distance-weighted influence; root movement is attenuated when anterior controls move. Edge-length relaxation limits spikes; the palate and pharyngeal wall exclude solid tissue penetration. The full polygon is checked for intersections and excessive sagittal area change. An inadmissible move is reduced continuously using bisection. Retroflex apex overhang is allowed, so x-order is not incorrectly enforced.

Mandibular movement uses a schematic hinge and gradual posterior attenuation; the ventral tongue contour shares the jaw transform. Jaw editing also redistributes the upper tongue. This is a geometric teaching model, not an anatomical guarantee or volume-conserving muscle simulation.

## Inference

Active articulator and passive region propose a place. Lip contact, tongue curl, rounding, glottal closure and epiglottic constriction provide separate evidence. Requested manner, voicing, velum and airflow gate candidate classes. Whole-tongue similarity ranks secondary gestures only within these phonetic constraints. A proximity number is geometric closeness, never a linguistic probability.

Closed fricatives, open stops and nasal settings without an open nasal port are rejected. A canonical label means close to this teaching preset, not a uniquely identified speech sound. Glottal fricatives and variable [ɧ] remain closest matches. Lessons accept a valid nearby configuration, rather than requiring a pixel-perfect preset copy.

## Animation

Independent manner timelines control closure, pressure, release and smooth/turbulent/nasal flow. Affricates release into a fricative gesture. Trills move the appropriate lip, apex or uvula. Retroflex transitions raise the apex before retracting it to avoid flattening apex and blade together. Reduced motion disables loops and presents steps. Timing is slow-motion teaching, not measured speech or audio synchronization.

## Audio and validation

The replaceable JSON audio manifest contains source, speaker/attribution, license and local or remote URL. Failures remain explicit. Thirteen automated tests cover all symbols, inference distinctions, geometry extremes, 3,198 animation samples, lesson reachability and media attribution. Static SVG contact sheets provide anatomical visual checks; browser interaction and WebMCP runtime validation are separate, currently unperformed checks.

## Active versus passive articulation

The interface displays the active organ and passive site separately (for example, apex–postalveolar versus blade–postalveolar). Retroflex is treated as a gesture, not an extra fixed piece of palate. Its free anterior contour uses local normals and a rounded apex cap; the floor attachment moves with the mandible. Backward apex dragging lets the blade bow forward/down, so retroflex configurations are reachable manually.

The five editable regions distinguish the extreme apex, blade just behind it, anterior tongue body, posterior tongue body and root. Subapical contact is described separately for the illustrated curled gesture. These are pedagogical regions, not a claim of universally discrete subdivisions.

Coronal distinctions reference Patricia Keating's discussion of active articulators and tongue shapes: https://linguistics.ucla.edu/people/keating/coronals.pdf . The model permits an apical postalveolar closest match without treating location alone as sufficient to distinguish [ʃ] from [ʂ].

