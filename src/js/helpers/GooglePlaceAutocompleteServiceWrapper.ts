//requires @types/googlemaps

const defaultComponents = {
    street_number: "long_name",
    route: "long_name",
    locality: "long_name",
    administrative_area_level_1: "long_name",
    country: "long_name",
    postal_code: "long_name"
};

const defaultSpec = {
    street_address: ["street_number", "route"],
    city: ["locality"],
    state: ["administrative_area_level_1"],
    zipcode: ["postal_code"],
    country: ["country"]
};

type Test<Z> = Z extends { [P in keyof Z]: string[] } ? Z : never;

export function extractGooglePlaceComponents<T = typeof defaultSpec>(
    place: google.maps.places.PlaceResult,
    spec: Test<T> = null,
    components = defaultComponents
): { [P in keyof T]: string } {
    if (spec === null) {
        spec = defaultSpec as any;
    }

    const extracted: { [P in keyof T]: string } = {} as any;
    const componentsRetrieved: { [index: string]: string } = {} as any;
    place.address_components.forEach(component => {
        const type = component.types[0];
        if (components[type]) {
            componentsRetrieved[type] = component[components[type]];
        }
    });

    for (const p in spec) {
        if (Object.prototype.hasOwnProperty.call(spec, p)) {
            const arr = spec[p].map(p2 => {
                if (componentsRetrieved[p2]) {
                    return componentsRetrieved[p2];
                } else {
                    return null;
                }
            });

            extracted[p as any] = arr
                .filter(val => val !== null)
                .join(" ")
                .trim();
        }
    }

    return extracted;
}

interface PredictionResponse {
    predictions: google.maps.places.AutocompletePrediction[];
    status: google.maps.places.PlacesServiceStatus;
}

interface PlaceDetailResponse {
    detail: google.maps.places.PlaceResult;
    status: google.maps.places.PlacesServiceStatus;
}

export class GooglePlaceAutocompleteServiceWrapper {
    protected autocompleteService: google.maps.places.AutocompleteService;
    protected placeService: google.maps.places.PlacesService;
    protected autocompleteRequest: google.maps.places.AutocompletionRequest;
    protected attributionElement: HTMLDivElement | any;

    constructor(
        autocompleteRequest: google.maps.places.AutocompletionRequest,
        attributionElement: HTMLDivElement | any
    ) {
        this.autocompleteRequest = autocompleteRequest;
        this.attributionElement = attributionElement;
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.placeService = new google.maps.places.PlacesService(
            attributionElement
        );
        this.resetSession();
    }

    protected resetSession() {
        this.autocompleteRequest.sessionToken = new google.maps.places.AutocompleteSessionToken();
    }

    getGooglePlacePredictions(input: string): Promise<PredictionResponse> {
        const promise = new Promise<PredictionResponse>(resolve => {
            this.autocompleteRequest.input = input;
            this.autocompleteService.getPlacePredictions(
                this.autocompleteRequest,
                (result, status) => {
                    resolve({
                        predictions: result,
                        status: status
                    });
                }
            );
        });

        return promise;
    }

    getGooglePlaceDetail(
        request: google.maps.places.PlaceDetailsRequest
    ): Promise<PlaceDetailResponse> {
        request.sessionToken = this.autocompleteRequest.sessionToken;
        this.resetSession();
        const promise = new Promise<PlaceDetailResponse>(resolve => {
            this.placeService.getDetails(request, (result, status) => {
                resolve({
                    detail: result,
                    status
                });
            });
        });
        return promise;
    }
}
