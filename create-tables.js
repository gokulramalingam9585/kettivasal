const pool = require("./database");

pool.connect();
const createTables = () => {
    const createEventsDetails = `CREATE TABLE IF NOT EXISTS eleva.events_details
    (
        id integer NOT NULL DEFAULT nextval('eleva.events_details_id_seq'::regclass),
        title text COLLATE pg_catalog."default",
        details text COLLATE pg_catalog."default",
        date date,
        from_time time without time zone,
        to_time time without time zone,
        location text COLLATE pg_catalog."default",
        status character varying COLLATE pg_catalog."default",
        cancel_reason text COLLATE pg_catalog."default",
        denied_reason text COLLATE pg_catalog."default",
        building_id text COLLATE pg_catalog."default",
        created_by character varying COLLATE pg_catalog."default",
        creator_id text COLLATE pg_catalog."default",
        secretary_notes text COLLATE pg_catalog."default",
        CONSTRAINT events_details_pkey PRIMARY KEY (id)
    )`;

    const createOccupantsDetails = `CREATE TABLE IF NOT EXISTS eleva.occupants_details
    (
        user_id text COLLATE pg_catalog."default" NOT NULL,
        first_name character varying COLLATE pg_catalog."default" NOT NULL,
        last_name character varying COLLATE pg_catalog."default",
        email_id character varying COLLATE pg_catalog."default",
        phone_number character varying COLLATE pg_catalog."default",
        profile_url character varying COLLATE pg_catalog."default",
        building_id text COLLATE pg_catalog."default" NOT NULL,
        floor_no integer NOT NULL,
        CONSTRAINT occupants_details_pkey PRIMARY KEY (user_id)
    )`;

    const createSecretaryDetails = `CREATE TABLE IF NOT EXISTS eleva.secretary_details
    (
        secretary_id text COLLATE pg_catalog."default" NOT NULL,
        first_name character varying COLLATE pg_catalog."default" NOT NULL,
        last_name character varying COLLATE pg_catalog."default",
        email_id character varying COLLATE pg_catalog."default",
        phone_number character varying COLLATE pg_catalog."default" NOT NULL,
        profile_url character varying COLLATE pg_catalog."default",
        building_id text COLLATE pg_catalog."default" NOT NULL,
        eleva_id integer NOT NULL,
        CONSTRAINT secretary_details_pkey PRIMARY KEY (secretary_id)
    )`
        ;

    const createMaintanenceDetails = `CREATE TABLE IF NOT EXISTS eleva.maintanence_details
    (
        id integer NOT NULL DEFAULT nextval('eleva.maintanence_details_id_seq'::regclass),
        eleva_id text COLLATE pg_catalog."default" NOT NULL,
        building_id text COLLATE pg_catalog."default" NOT NULL,
        secretary_id text COLLATE pg_catalog."default" NOT NULL,
        date date,
        from_time time without time zone,
        to_time time without time zone,
        CONSTRAINT maintanence_details_pkey PRIMARY KEY (id)
    )
    `;

    const createElevaDetails = `
    CREATE TABLE IF NOT EXISTS eleva.eleva_details
    (
        eleva_name character varying COLLATE pg_catalog."default" NOT NULL,
        eleva_id integer NOT NULL DEFAULT nextval('eleva.eleva_details_eleva_id_seq'::regclass),
        building_id integer NOT NULL,
        secretary_id text COLLATE pg_catalog."default" NOT NULL,
        date date NOT NULL,
        music boolean,
        date_time boolean DEFAULT true,
        weather_details boolean,
        advertisement boolean,
        articles boolean,
        speed character varying COLLATE pg_catalog."default" NOT NULL,
        vibration character varying COLLATE pg_catalog."default" NOT NULL,
        temperature character varying COLLATE pg_catalog."default" NOT NULL,
        oil_level character varying COLLATE pg_catalog."default" NOT NULL,
        temperature_sensor character varying COLLATE pg_catalog."default" NOT NULL,
        pressure_sensor character varying COLLATE pg_catalog."default" NOT NULL,
        load_sensor character varying COLLATE pg_catalog."default" NOT NULL,
        location double precision NOT NULL,
        current_floor integer NOT NULL,
        to_floor integer NOT NULL,
        current_weight integer NOT NULL,
        total_weight integer NOT NULL,
        door_open integer NOT NULL,
        emergency_contact integer NOT NULL,
        "time" time without time zone NOT NULL,
        CONSTRAINT eleva_details_pkey PRIMARY KEY (eleva_id)
    )`
        ;

    const createBuildingDetails = `CREATE TABLE IF NOT EXISTS eleva.building_details
    (
        building_id integer NOT NULL DEFAULT nextval('eleva.building_details_building_id_seq'::regclass),
        building_name character varying COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT building_details_pkey PRIMARY KEY (building_id)
    );
    `
    pool.query(createEventsDetails)
        .then(() => pool.query(createBuildingDetails))
        .then(() => pool.query(createMaintanenceDetails))
        .then(() => pool.query(createOccupantsDetails))
        .then(() => pool.query(createSecretaryDetails))
        .then(() => pool.query(createElevaDetails))
        .then(() => console.log('Tables created successfully'))
        .catch(err => console.error(err))
        .finally(() => pool.end());

}

module.exports = createTables;